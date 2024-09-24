export function formatList(
  list: string[],
  type: "conjunction" | "disjuction" | "unit" = "conjunction",
) {
  const isSingleItem = list.length === 1;

  if (isSingleItem) return list[0];

  let formattedList = "";
  const lastIndex = list.length - 1;

  for (const itemIndex in list) {
    const item = list[itemIndex];

    if (+itemIndex === lastIndex) {
      let endStatement = "";
      if (type === "conjunction") {
        endStatement = "and";
      }
      if (type === "disjuction") {
        endStatement = "or";
      }
      formattedList += `${endStatement} ${item}`;
    } else {
      formattedList += `${item}, `;
    }
  }

  return formattedList;
}
