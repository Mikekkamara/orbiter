<template>
  <article class="p-3 bg-[#0a0a0a] text-white h-screen overflow-y-scroll">
    <h4 class="text-xl p-5 underline underline-offset-4 font-bold">Check results in the console.</h4>
    <ul class="p-5 flex flex-col gap-10">
      <li>
        <section class="rounded-xl p-2 bg-[#171717] border-[#171717]">1. FizzBuzz</section>
        <section class="p-3 mt-4">
          <input v-model="fizzBuzzInput" type="number" class="w-full border text-lg p-2 text-white bg-[#0a0a0a]" />
          <button @click="fizzBuzz" class="hover:ring ring-white/25 mt-5 transition-all duration-500 ease-in-out p-3 rounded-xl bg-[#171717] w-full">FizzBuzz!</button>
        </section>
      </li>
      <li>
        <section class="rounded-xl p-2 bg-[#171717] border-[#171717]">2. CSS Content Position</section>
        <section class="p-3 mt-4">
          <a href="/test-two.html" class="hover:ring ring-white/25 mt-5 transition-all duration-500 ease-in-out p-3 rounded-xl bg-[#171717] w-full underline underline-offset-4 block text-center"
            >CSS Content Position</a
          >
        </section>
      </li>
      <li>
        <section class="rounded-xl p-2 bg-[#171717] border-[#171717]">3. Cheap Letter Deletion</section>
        <section class="p-3 mt-4">
          <label for="phrase">Phrase (S)</label>
          <input v-model="phrase" class="w-full border text-lg p-2 text-white bg-[#0a0a0a]" />
          <label class="block mt-2" for="cost">Cost (C): comma separated</label>
          <input v-model="phraseCost" class="w-full border text-lg p-2 text-white bg-[#0a0a0a]" />

          <button @click="calculateCost" class="hover:ring ring-white/25 mt-5 transition-all duration-500 ease-in-out p-3 rounded-xl bg-[#171717] w-full">Calculate Cost</button>
        </section>
      </li>
      <li>
        <section class="rounded-xl p-2 bg-[#171717] border-[#171717]">4. Fib Digits</section>
        <section class="p-3 mt-4">
          <label for="phrase">Nth number in the sequence: (0, 1, 1, 2, 3, 5, 8, 13, 12, 7, 10, 8, 9, ...)</label>
          <input v-model="nthNumber" class="w-full border text-lg p-2 text-white bg-[#0a0a0a]" />

          <button @click="fibDigits()" class="hover:ring ring-white/25 mt-5 transition-all duration-500 ease-in-out p-3 rounded-xl bg-[#171717] w-full">Fib Digits</button>
        </section>
      </li>
    </ul>
  </article>
</template>
<script setup lang="ts">
const fizzBuzzInput = ref(7);
const fizzBuzz = () => {
  const n = fizzBuzzInput.value;
  if (n === 0) return;
  for (let i = 1; i <= n; i++) {
    const isPow = (i & (i - 1)) == 0;
    console.log(`${isPow ? "POWER" : i} \n`);
  }
};

const regex = /(.)\1+/g;

const phrase = ref("ababa"),
  phraseCost = ref(`10, 5, 10, 5, 10`);
const calculateCost = () => {
  if (phrase.value.length === 0) {
    console.log("invalid phrase");
    return;
  }
  if (phraseCost.value.split(",").some((item) => isNaN(Number(item)))) {
    console.log("invalid cost phrase");
    return;
  }

  let s = phrase.value,
    cost = phraseCost.value.split(",").map((item) => Number(item));

  if (phrase.value.length !== cost.length) {
    console.log("phrase length not equal to cost length");
    return;
  }

  let totalCost = 0,
    matches = s.match(regex);

  if (!matches) {
    console.log(s, totalCost, "no matches found");
    return;
  }

  const originalPhrase = structuredClone(s);

  for (let i = 0; i < matches.length; i++) {
    const indexOfMatch = originalPhrase.indexOf(matches[i]);
    const costs = matches[i]
      .split("")
      .map((letter, letterIndex) => cost[indexOfMatch + letterIndex])
      .sort((a, b) => a - b);

    s = s.replace(matches[i], matches[i].charAt(0));

    totalCost += costs.slice(0, costs.length - 1).reduce((totalValue, currentValue) => (totalValue += currentValue), 0);
  }

  matches = s.match(regex);

  console.log(s, totalCost);
};

const nthNumber = ref(6);

const getNthInSequence = (n: number): number => {
  if (n < 2) return n;
  return [
    ...getNthInSequence(n - 2)
      .toString()
      .split(""),
    ...getNthInSequence(n - 1)
      .toString()
      .split(""),
  ].reduce((totalValue, currentValue) => {
    return totalValue + Number(currentValue);
  }, 0);
};

const fibDigits = () => {
  console.log(getNthInSequence(nthNumber.value));
};
</script>
