export { data };

export type Data = Awaited<ReturnType<typeof data>>;

async function data() {
  await new Promise((resolve) =>
    setTimeout(resolve, 400 + Math.random() * 200)
  );

  return {
    randomValue: Math.random(),
  };
}
