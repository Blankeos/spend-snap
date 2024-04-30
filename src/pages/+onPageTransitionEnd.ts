import NProgress from "nprogress";

export { onPageTransitionEnd };

// Create custom page transition animations
async function onPageTransitionEnd() {
  NProgress.done();
}
