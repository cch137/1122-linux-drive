export default function (title?: string) {
  const _title = useState('title', () => title);
  if (title !== undefined) {
    useHead({
      title,
      meta: [
        { property: 'og:title', content: title },
        { property: 'twitter:title', content: title },
      ]
    });
    _title.value = title;
  }
  return _title;
}