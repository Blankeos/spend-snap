import NProgress from "nprogress";

export { onPageTransitionStart };

// Create custom page transition animations
async function onPageTransitionStart() {
  NProgress.start();
}
