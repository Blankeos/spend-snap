export { data };

export type Data = Awaited<ReturnType<typeof data>>;

async function data() {
  await new Promise((resolve) =>
    setTimeout(resolve, 1500 + Math.random() * 1000)
  );

  return {
    randomValue: Math.random(),
  };
}
