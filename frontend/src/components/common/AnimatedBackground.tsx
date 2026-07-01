/**
 * AnimatedBackground — reusable global ambient background layer.
 * Uses CSS-only transforms/opacity animations. Never distracting.
 * Include once per layout (DashboardLayout, auth pages).
 */
const AnimatedBackground = () => {
  return (
    <div className="animated-bg" aria-hidden="true">
      <div className="animated-bg__blob animated-bg__blob--1" />
      <div className="animated-bg__blob animated-bg__blob--2" />
      <div className="animated-bg__blob animated-bg__blob--3" />
      <div className="animated-bg__blob animated-bg__blob--4" />
      <div className="animated-bg__mesh" />
    </div>
  );
};

export default AnimatedBackground;
