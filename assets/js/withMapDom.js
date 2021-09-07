export default function withMapDOM() {
  return {
    mapDOM(scope) {
      const getChildren = node =>
        node.hasChildNodes()
          ? [node].concat([...node.children].map(getChildren))
          : node;
      return getChildren(scope)
        .flat(Infinity)
        .filter(
          child =>
            typeof child.hasAttribute === "function" && child.hasAttribute("id")
        )
        .reduce((acc, child) => ({ ...acc, [child.id]: child }), {});
    },
  };
}
