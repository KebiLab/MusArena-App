export function ThemeScript() {
  const code = `
(function() {
  try {
    var t = localStorage.getItem('musarena-theme');
    var theme = 'dark';
    if (t) {
      try {
        var parsed = JSON.parse(t);
        if (parsed && parsed.state && (parsed.state.theme === 'light' || parsed.state.theme === 'dark')) {
          theme = parsed.state.theme;
        }
      } catch (e) {}
    }
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  } catch (e) {}
})();
`;
  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}
