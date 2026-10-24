import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Crypto from "expo-crypto";

import { supabase } from "@/lib/supabase";
import { ToolId, PRIVATE_TOOLS } from "@/lib/private-tools";

export async function loadPrivateRows(tool: ToolId, userId: string) {
  const spec = PRIVATE_TOOLS[tool];
  const client = supabase as any;
  const { data, error } = await client.from(spec.table)
    .select(spec.columns)
    .eq("user_id", userId)
    .order(spec.orderBy, { ascending: spec.ascending })
    .limit(tool === "trucks" ? 1000 : 500);
  if (error) throw error;
  return (data ?? []) as Record<string, any>[];
}

export function createPrivateRecord(tool: ToolId, userId: string, values: Record<string, string>) {
  const client = supabase as any;
  const clean = Object.fromEntries(Object.entries(values).map(([key, value]) => [key, value.trim() || null]));
  if (tool === "trucks") {
    const vin = values.vin?.trim().toUpperCase() || null;
    if (!values.unit_number?.trim() && !vin) throw new Error("Enter a unit number or VIN.");
    return client.from(PRIVATE_TOOLS[tool].table).insert({
      user_id: userId,
      unit_number: values.unit_number?.trim() || null,
      vin,
      year: Number.parseInt(values.year ?? "", 10) || null,
      make: values.make?.trim() || null,
      model: values.model?.trim() || null,
      engine: values.engine?.trim() || null,
      engine_serial: values.engine_serial?.trim() || null,
      notes: values.notes?.trim() || null,
    });
  }
  if (tool === "calls") {
    return client.from(PRIVATE_TOOLS[tool].table).insert({
      user_id: userId,
      customer: values.customer?.trim() || null,
      phone: values.phone?.trim() || null,
      category: "call_note",
      vehicle: values.vehicle?.trim() || null,
      request: values.request?.trim() || null,
      next_action: values.next_action?.trim() || null,
      transcript: null,
      status: "saved",
      source: "truckfixhub",
    });
  }
  if (tool === "warranty") {
    const vin = values.vin?.trim().toUpperCase() || null;
    if (!values.customer?.trim() && !values.unit_number?.trim() && !vin && !values.failed_part_number?.trim()) {
      throw new Error("Enter a customer, unit, VIN, or failed part.");
    }
    return client.from(PRIVATE_TOOLS[tool].table).insert({
      ...clean,
      user_id: userId,
      vin,
      attachment_names: [],
    });
  }
  if (tool === "parts" && !values.part_number?.trim() && !values.description?.trim()) {
    throw new Error("Enter a part number or description.");
  }
  if (tool === "calendar" && (!values.title?.trim() || !/^\d{4}-\d{2}-\d{2}$/.test(values.event_date ?? ""))) {
    throw new Error("Enter an event title and date in YYYY-MM-DD format.");
  }
  return client.from(PRIVATE_TOOLS[tool].table).insert({ ...clean, user_id: userId });
}

export async function deletePrivateRecord(tool: ToolId, userId: string, id: string | number) {
  const client = supabase as any;
  const { error } = await client.from(PRIVATE_TOOLS[tool].table).delete().eq("id", id).eq("user_id", userId);
  if (error) throw error;
}

export type CommunityPost = {
  id: string | number;
  author_id: string;
  author_name: string;
  title: string | null;
  body: string;
  media: Array<{ url: string; type?: string; name?: string; path?: string }> | null;
  image_url?: string | null;
  created_at: string;
};

export type CommunityReply = {
  id: string | number;
  post_id: string | number;
  author_id: string;
  author_name: string;
  body: string;
  created_at: string;
};

export const COMMUNITY_POST_PAGE_SIZE = 20;

export async function loadCommunity(offset = 0) {
  const { data: postData, error: postError, count } = await supabase.from("tfh_community_posts")
    .select("id,author_id,author_name,title,body,media,image_url,created_at", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(offset, offset + COMMUNITY_POST_PAGE_SIZE - 1);
  if (postError) throw postError;
  const posts = (postData ?? []) as CommunityPost[];
  const postIds = posts.map((post) => post.id);
  let replies: CommunityReply[] = [];
  if (postIds.length > 0) {
    const { data: replyData, error: replyError } = await supabase.from("tfh_community_replies")
      .select("id,post_id,author_id,author_name,body,created_at")
      .in("post_id", postIds)
      .order("created_at", { ascending: false })
      .limit(1000);
    if (replyError) throw replyError;
    replies = (replyData ?? []) as CommunityReply[];
  }
  const nextOffset = offset + posts.length < (count ?? offset + posts.length) ? offset + posts.length : undefined;
  return { posts, replies, nextOffset };
}

async function uploadCommunityMedia(userId: string, asset: { uri: string; fileName?: string | null; mimeType?: string | null; fileSize?: number | null }) {
  if (asset.fileSize && asset.fileSize > 50 * 1024 * 1024) throw new Error("Choose a photo or video under 50 MB.");
  const response = await fetch(asset.uri);
  const blob = await response.blob();
  if (blob.size > 50 * 1024 * 1024) throw new Error("Choose a photo or video under 50 MB.");
  const name = (asset.fileName || "community-upload").replace(/[^a-zA-Z0-9._-]/g, "_");
  const path = `${userId}/${Date.now()}-${Crypto.randomUUID()}-${name}`;
  const contentType = asset.mimeType || blob.type || "application/octet-stream";
  const { error } = await supabase.storage.from("community-media").upload(path, blob, { contentType, upsert: false });
  if (error) throw error;
  const { data } = supabase.storage.from("community-media").getPublicUrl(path);
  return { url: data.publicUrl, type: contentType, name, path };
}

async function hashDeleteKey(key: string) {
  return Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, key);
}

export async function createCommunityPost(userId: string, authorName: string, title: string, body: string, asset?: { uri: string; fileName?: string | null; mimeType?: string | null; fileSize?: number | null }) {
  if (!body.trim() && !asset) throw new Error("Write a question or add a photo/video first.");
  const deleteKey = `${Crypto.randomUUID()}${Crypto.randomUUID()}`;
  const deleteKeyHash = await hashDeleteKey(deleteKey);
  let uploadedMedia: Awaited<ReturnType<typeof uploadCommunityMedia>> | undefined;
  try {
    if (asset) uploadedMedia = await uploadCommunityMedia(userId, asset);
    const { data, error } = await supabase.from("tfh_community_posts").insert({
      author_id: userId,
      author_name: authorName.trim() || "TruckFixHub member",
      title: title.trim() || null,
      body: body.trim() || "Shared media",
      category: "Community",
      media: uploadedMedia ? [uploadedMedia] : [],
      delete_key_hash: deleteKeyHash,
    }).select("id").single();
    if (error) throw error;
    try { await AsyncStorage.setItem(`tfh-del-post-${data.id}`, deleteKey); } catch { /* the post succeeded; local deletion-key storage is best-effort */ }
  } catch (error) {
    if (uploadedMedia) {
      try { await supabase.storage.from("community-media").remove([uploadedMedia.path]); } catch { /* preserve the original post error */ }
    }
    throw error;
  }
}

export async function createCommunityReply(userId: string, authorName: string, postId: string | number, body: string) {
  if (!body.trim()) throw new Error("Write a reply first.");
  const deleteKey = `${Crypto.randomUUID()}${Crypto.randomUUID()}`;
  const deleteKeyHash = await hashDeleteKey(deleteKey);
  const { data, error } = await supabase.from("tfh_community_replies").insert({
    post_id: postId,
    author_id: userId,
    author_name: authorName.trim() || "TruckFixHub member",
    body: body.trim(),
    delete_key_hash: deleteKeyHash,
  }).select("id").single();
  if (error) throw error;
  try { await AsyncStorage.setItem(`tfh-del-reply-${data.id}`, deleteKey); } catch { /* the reply succeeded; local deletion-key storage is best-effort */ }
}
