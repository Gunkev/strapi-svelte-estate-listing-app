// @ts-nocheck
/** @param {Parameters<import('./$types').PageLoad>[0]} event */ export async function load({
  params,
}) {
  console.log("update", params);

  return {
    params,
  };
}
