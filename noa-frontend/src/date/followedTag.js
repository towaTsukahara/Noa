let followedTags = [
  "React",
  "AWS",
];

export const getFollowedTags = () =>
  followedTags;

export const followTag = (tagName) => {
  if (!followedTags.includes(tagName)) {
    followedTags = [
      ...followedTags,
      tagName,
    ];
  }
};

export const unfollowTag = (tagName) => {
  followedTags = followedTags.filter(
    (name) => name !== tagName
  );
};