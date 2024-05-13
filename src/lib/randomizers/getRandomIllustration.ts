import Rand, { PRNG } from "rand-seed";

// Illustrations
import credit_card from "@/assets/illustrations/credit_card.png";
import gold_card from "@/assets/illustrations/gold_card.png";
import wallet from "@/assets/illustrations/wallet.png";

const illustrations = [credit_card, gold_card, wallet];

export function getRandomIllustration(seed: string) {
  const prng = new Rand(seed, PRNG.xoshiro128ss);
  const index = Math.floor(prng.next() * illustrations.length);

  return illustrations?.at(index);
}
