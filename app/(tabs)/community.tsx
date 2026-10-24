import { Ionicons } from "@expo/vector-icons";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import * as ImagePicker from "expo-image-picker";
import { Href, router } from "expo-router";
import { useMemo, useState } from "react";
import { ActivityIndicator, Image, KeyboardAvoidingView, Linking, Modal, Platform, Pressable, ScrollView, Text, View } from "react-native";

import { AppScreen, ErrorText, FormField, LoadingState, Notice, PageHeading, Panel, PrimaryButton, SectionHeading } from "@/components/brand-ui";
import { BRAND } from "@/constants/truckfixhub";
import { useAuth } from "@/lib/auth-context";
import { CommunityReply, createCommunityPost, createCommunityReply, loadCommunity } from "@/lib/truckfixhub-data";
import { TRUCKFIXHUB_SUPABASE_URL } from "@/lib/supabase";

const EMPTY_COMMUNITY_REPLIES: CommunityReply[] = [];

export default function CommunityScreen() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const communityQuery = useInfiniteQuery({
    queryKey: ["truckfixhub", "community"],
    queryFn: ({ pageParam }) => loadCommunity(pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextOffset,
  });
  const pages = communityQuery.data?.pages;
  const posts = useMemo(() => pages?.flatMap((page) => page.posts) ?? [], [pages]);
  const replies = useMemo(() => pages?.flatMap((page) => page.replies) ?? EMPTY_COMMUNITY_REPLIES, [pages]);
  const loading = communityQuery.isLoading;
  const [actionError, setActionError] = useState("");
  const [composerOpen, setComposerOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [authorName, setAuthorName] = useState(user?.email?.split("@")[0] ?? "");
  const [asset, setAsset] = useState<ImagePicker.ImagePickerAsset | undefined>();
  const [posting, setPosting] = useState(false);
  const [postError, setPostError] = useState("");
  const [replyDrafts, setReplyDrafts] = useState<Record<string, string>>({});
  const [replyBusy, setReplyBusy] = useState<string | null>(null);
  const error = actionError || (communityQuery.error instanceof Error ? communityQuery.error.message : "");

  const repliesByPost = useMemo(() => {
    const grouped: Record<string, CommunityReply[]> = {};
    for (const reply of replies) (grouped[String(reply.post_id)] ??= []).push(reply);
    return grouped;
  }, [replies]);

  const refresh = async () => {
    setActionError("");
    await queryClient.resetQueries({ queryKey: ["truckfixhub", "community"] });
  };

  const chooseMedia = async () => {
    setPostError("");
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) { setPostError("Allow photo-library access to attach a photo or video."); return; }
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ["images", "videos"], allowsEditing: false, quality: 0.85, videoMaxDuration: 180 });
    if (!result.canceled) setAsset(result.assets[0]);
  };

  const submitPost = async () => {
    if (!user) return;
    setPosting(true);
    setPostError("");
    try {
      await createCommunityPost(user.id, authorName || user.email?.split("@")[0] || "TruckFixHub member", title, body, asset ? { uri: asset.uri, fileName: asset.fileName, mimeType: asset.mimeType, fileSize: asset.fileSize } : undefined);
      setTitle(""); setBody(""); setAsset(undefined); setComposerOpen(false);
      await refresh();
    } catch (e) {
      setPostError(e instanceof Error ? e.message : "Could not post your question.");
    } finally { setPosting(false); }
  };

  const submitReply = async (postId: string | number) => {
    if (!user) return;
    const key = String(postId);
    setReplyBusy(key);
    setActionError("");
    try {
      await createCommunityReply(user.id, authorName || user.email?.split("@")[0] || "TruckFixHub member", postId, replyDrafts[key] ?? "");
      setReplyDrafts((old) => ({ ...old, [key]: "" }));
      await refresh();
    } catch (e) { setActionError(e instanceof Error ? e.message : "Could not add the reply."); }
    finally { setReplyBusy(null); }
  };

  const startQuestion = () => {
    if (!user) { router.push("/(tabs)/garage" as Href); return; }
    setPostError("");
    setComposerOpen(true);
  };

  return (
    <>
      <AppScreen>
        <PageHeading eyebrow="Truck people helping truck people" title="Community" subtitle="Ask a truck question, share what worked, or help somebody with a problem you've seen before." />
        <PrimaryButton label="Ask a question" icon="create-outline" onPress={startQuestion} />
        <PrimaryButton label="Open the full TruckFixHub community" icon="open-outline" variant="secondary" onPress={() => void Linking.openURL("https://truckfixhub.com/community.html")} />
        {!user ? <Notice title="Sign in to take part" tone="blue">Use the same TruckFixHub account as the website to post questions and replies.</Notice> : null}
        <Notice title="Community safety" tone="yellow">Answers come from users, not manufacturers. Verify safety-critical repairs and specifications with current manufacturer information. Keep posts respectful and do not share private information.</Notice>
        <View style={{ gap: 10 }}>
          <SectionHeading title="Recent conversations" action={loading ? undefined : "Refresh"} onAction={() => void refresh()} />
          {loading ? <LoadingState label="Loading conversations…" /> : null}
          {error ? <ErrorText>{error}</ErrorText> : null}
          {!loading && !error && posts.length === 0 ? <Panel><Text style={{ color: BRAND.navy, fontSize: 16, fontWeight: "900" }}>No conversations yet</Text><Text style={{ color: BRAND.muted, fontSize: 13, lineHeight: 20 }}>Be the first to share what you observed and what fixed it.</Text></Panel> : null}
          {posts.map((post) => {
            const postReplies = repliesByPost[String(post.id)] ?? [];
            const recentReplies = postReplies.slice(0, 4).reverse();
            const media = (post.media ?? (post.image_url ? [{ url: post.image_url, type: "image/unknown" }] : [])).filter((item) => isCommunityMediaUrl(item.url));
            return (
              <Panel key={String(post.id)}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 9 }}>
                  <View style={{ width: 34, height: 34, borderRadius: 12, backgroundColor: "#e9f4fc", alignItems: "center", justifyContent: "center" }}><Ionicons name="person-outline" size={18} color={BRAND.blue} /></View>
                  <View style={{ flex: 1 }}><Text style={{ color: BRAND.navy, fontSize: 13, fontWeight: "900" }}>{post.author_name || "TruckFixHub member"}</Text><Text style={{ color: BRAND.muted, fontSize: 11, marginTop: 2 }}>{formatDate(post.created_at)}</Text></View>
                </View>
                {post.title ? <Text style={{ color: BRAND.navy, fontSize: 17, lineHeight: 23, fontWeight: "900" }}>{post.title}</Text> : null}
                {post.body ? <Text style={{ color: BRAND.ink, fontSize: 14, lineHeight: 21 }}>{post.body}</Text> : null}
                {media.map((item, index) => item.type?.startsWith("image/")
                  ? <Image key={`${item.url}-${index}`} source={{ uri: item.url }} resizeMode="cover" style={{ width: "100%", height: 190, borderRadius: 12, backgroundColor: "#e7edf2" }} />
                  : item.url ? <Pressable key={`${item.url}-${index}`} onPress={() => void Linking.openURL(item.url)} style={{ padding: 11, flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: "#f1f6fa", borderRadius: 11 }}><Ionicons name="play-circle-outline" size={22} color={BRAND.blue} /><Text style={{ color: BRAND.blue, fontWeight: "800" }}>Open video attachment</Text></Pressable> : null)}
                <View style={{ borderTopWidth: 1, borderTopColor: "#edf1f5", paddingTop: 10, gap: 9 }}>
                  <Text style={{ color: BRAND.navy, fontSize: 13, fontWeight: "900" }}>Recent replies</Text>
                  {recentReplies.length === 0 ? <Text style={{ color: BRAND.muted, fontSize: 12 }}>Be the first to reply.</Text> : recentReplies.map((reply) => <View key={String(reply.id)} style={{ borderLeftWidth: 2, borderLeftColor: "#cde4f4", paddingLeft: 9, gap: 2 }}><Text style={{ color: BRAND.navy, fontSize: 12, fontWeight: "800" }}>{reply.author_name || "TruckFixHub member"}</Text><Text style={{ color: BRAND.ink, fontSize: 13, lineHeight: 18 }}>{reply.body}</Text></View>)}
                  {user ? <View style={{ gap: 8 }}><FormField label="Add a reply" value={replyDrafts[String(post.id)] ?? ""} onChangeText={(value) => setReplyDrafts((old) => ({ ...old, [String(post.id)]: value }))} placeholder="Share what you observed or tested" multiline /><PrimaryButton label={replyBusy === String(post.id) ? "Sending…" : "Reply"} icon="chatbubble-outline" disabled={replyBusy === String(post.id)} onPress={() => void submitReply(post.id)} /></View> : null}
                </View>
              </Panel>
            );
          })}
          {communityQuery.hasNextPage ? <PrimaryButton label={communityQuery.isFetchingNextPage ? "Loading…" : "Load older conversations"} icon="chevron-down-outline" variant="secondary" disabled={communityQuery.isFetchingNextPage} onPress={() => void communityQuery.fetchNextPage()} /> : null}
        </View>
      </AppScreen>
      <Modal visible={composerOpen} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setComposerOpen(false)}>
        <KeyboardAvoidingView style={{ flex: 1, backgroundColor: BRAND.canvas }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
          <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ padding: 20, gap: 15, paddingBottom: 36 }}>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}><Text style={{ color: BRAND.navy, fontSize: 24, fontWeight: "900" }}>Ask the community</Text><Pressable onPress={() => setComposerOpen(false)} accessibilityLabel="Close question form"><Ionicons name="close-circle" size={28} color={BRAND.muted} /></Pressable></View>
            <Notice tone="blue">Share what you noticed, under what conditions, and what you have already tested. Do not post private information.</Notice>
            <FormField label="Name shown" value={authorName || user?.email?.split("@")[0] || ""} onChangeText={setAuthorName} placeholder="How should your name appear?" />
            <FormField label="Question title (optional)" value={title} onChangeText={setTitle} placeholder="A short summary" />
            <FormField label="What is happening?" value={body} onChangeText={setBody} placeholder="Describe the truck, symptom, and what you have checked…" multiline />
            <PrimaryButton label={asset ? "Change photo or video" : "Add a photo or video (optional)"} icon="image-outline" variant="secondary" onPress={() => void chooseMedia()} />
            {asset ? <View style={{ flexDirection: "row", gap: 9, alignItems: "center" }}><Ionicons name={asset.type === "video" ? "videocam-outline" : "image-outline"} size={20} color={BRAND.blue} /><Text numberOfLines={1} style={{ flex: 1, color: BRAND.navy, fontSize: 13 }}>{asset.fileName || "Selected attachment"}</Text><Pressable onPress={() => setAsset(undefined)} accessibilityLabel="Remove attachment"><Ionicons name="close-circle" size={20} color={BRAND.red} /></Pressable></View> : null}
            {postError ? <ErrorText>{postError}</ErrorText> : null}
            <PrimaryButton label={posting ? "Posting…" : "Post question"} icon="send-outline" disabled={posting} onPress={() => void submitPost()} />
            {posting ? <ActivityIndicator color={BRAND.blue} /> : null}
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>
    </>
  );
}

function formatDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

function isCommunityMediaUrl(value: string) {
  return value.startsWith(`${TRUCKFIXHUB_SUPABASE_URL}/storage/v1/object/public/community-media/`);
}
