import fallbackLogo from "../assets/images/logo.png";

// Reham's real profile photo, shown next to her name in Mail.app's contact
// card. To add the real picture: drop the file at
// src/assets/images/reham-profile.jpg (any common image format works, just
// match the extension below), then swap the two lines under it in for the
// two lines commented out here:
//
//   import profileImagePhoto from "../assets/images/reham-profile.jpg";
//   export const profileImage = profileImagePhoto;
//
// Until a real photo is added, `profileImage` stays null and Mail.app shows
// the portfolio logo inside the same rounded-square frame instead — never a
// broken image and never the old initials avatar.
export const profileImage = null;
export const profileImageFallback = fallbackLogo;
