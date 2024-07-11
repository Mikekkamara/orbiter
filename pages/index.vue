<template>
  <article ref="container" class="h-full flex font-display flex-col items-center justify-end text-white relative overflow-hidden mx-auto max-w-[1920px]">
    <section
      v-for="(message, messageIndex) in messages"
      :key="`message-${messageIndex}`"
      :class="{ 'opacity-0': messageIndex >= currentIndex + 7 || messageIndex < currentIndex, 'border border-green-400': false }"
      class="absolute max-w-none w-full orbit transition-all duration-700 ease-out hidden rounded-t-full"
    >
      <svg
        width="100%"
        height="100%"
        class="orbit-svg pointer-events-none"
        style="width: 100%; overflow: visible; position: relative"
        viewBox="0 0 1714 844"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <mask id="path-1-inside-1_590_222972" fill="white">
          <path
            d="M1713.89 857.625C1713.89 745.119 1691.73 633.714 1648.68 529.772C1605.62 425.829 1542.52 331.385 1462.97 251.831C1383.41 172.277 1288.97 109.171 1185.02 66.1165C1081.08 23.0621 969.677 0.902339 857.17 0.902344C744.664 0.902349 633.259 23.0622 529.317 66.1165C425.374 109.171 330.93 172.277 251.376 251.831C171.822 331.385 108.716 425.829 65.6614 529.772C22.607 633.714 0.447256 745.119 0.447266 857.626L857.17 857.625H1713.89Z"
          />
        </mask>
        <path
          id="orbit-arc"
          d="M1713.89 857.625C1713.89 745.119 1691.73 633.714 1648.68 529.772C1605.62 425.829 1542.52 331.385 1462.97 251.831C1383.41 172.277 1288.97 109.171 1185.02 66.1165C1081.08 23.0621 969.677 0.902339 857.17 0.902344C744.664 0.902349 633.259 23.0622 529.317 66.1165C425.374 109.171 330.93 172.277 251.376 251.831C171.822 331.385 108.716 425.829 65.6614 529.772C22.607 633.714 0.447256 745.119 0.447266 857.626L857.17 857.625H1713.89Z"
          stroke="url(#paint0_linear_590_222972)"
          stroke-width="2"
          mask="url(#path-1-inside-1_590_222972)"
        />
        <use xlink:href="#path-1-inside-1_590_222972" />
        <defs>
          <linearGradient id="paint0_linear_590_222972" x1="857.17" y1="-112.23" x2="857.17" y2="794.378" gradientUnits="userSpaceOnUse">
            <stop stop-color="white" />
            <stop offset="1" stop-color="white" stop-opacity="0" />
          </linearGradient>
        </defs>
        <foreignObject x="0" y="0" width="164" height="288" style="overflow: visible;scale(2)">
          <section>
            <n-popover v-for="orb in message.array" trigger="hover" :placement="'right'" :show-arrow="false">
              <template #trigger>
                <button
                  v-lazy:background-image="orb.img"
                  :class="[messageIndex >= currentIndex + 7 || messageIndex < currentIndex ? 'pointer-events-none' : 'pointer-events-auto']"
                  class="rounded-full group/orb transition-all duration-100 ease-in-out cursor-pointer orb h-[3.75rem] bg-top bg-cover bg-no-repeat opacity-0 w-[3.75rem] absolute border-t-2 ring-8 ring-[#0a0a0a]"
                ></button>
              </template>
              <lazy-the-card :message="orb" :created-at="message.contact_date" class="max-w-[502px] pointer-events-auto"></lazy-the-card>
            </n-popover>
            <section v-if="messageIndex === currentIndex" class="bg-[#0a0a0a] text-[#929292] rounded-full orb orb-center opacity-0 absolute whitespace-nowrap p-1 px-2 font-[16px]">
              {{ isToday(message.contact_date) ? "Today" : message.contact_date }}
            </section>
            <button
              @click="toggleShowMore(messageIndex)"
              v-if="message.array.length > 6"
              class="rounded-full flex items-center hover:border-t-4 transition-all duration-500 ease-in-out justify-center pointer-events-auto cursor-pointer orb orb-last h-[3rem] text-white opacity-0 w-[3rem] absolute border border-[#9a9a9a] ring-8 ring-[#0a0a0a] bg-[#171717]"
            >
              <Transition name="fade">
                <svg v-if="isReversing(messageIndex)" width="24" height="25" viewBox="0 0 24 25" class="rotate-180" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 9.75L12 15.75L18 9.75" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                <span v-else-if="hiddenMessages(messageIndex) > 0"> + {{ hiddenMessages(messageIndex) + 1 }} </span>
              </Transition>
            </button>
          </section>
        </foreignObject>
      </svg>
    </section>
    <button class="h-14 w-14 md:h-16 md:w-16 lg:h-20 lg:w-20 z-30 rounded-full absolute bottom-[5%] overflow-hidden border border-white">
      <img src="/logo.png" />
    </button>
  </article>
</template>
<script setup lang="ts">
import gsap from "gsap";
import { NPopover } from "naive-ui";
import { Observer, MotionPathPlugin } from "gsap/all";
import { transition } from "d3";

const currentIndex = ref(0),
  prefetching = ref(false),
  noMoreResults = ref(false);

watch(
  () => currentIndex.value,
  async (currentValue, previousValue) => {
    const shouldFetchNextResults = () => {
      return currentValue > previousValue && messages.value!.length - (currentValue + 6) <= 2;
    };

    // if (shouldFetchNextResults() && messages.value && !noMoreResults.value) {
    //   if (!prefetching.value) {
    //     prefetching.value = true;
    //     const lastDate = new Date(messages.value[messages.value.length - 1].contact_date);
    //     lastDate.setDate(lastDate.getDate() - 1);
    //     const nextPageMessages = await $fetch<Message[]>(`https://xsrr-l2ye-dpbj.f2.xano.io/api:oUvfVMO5/receive_week?start_date=${formatDate(lastDate)}`, {
    //       headers: {
    //         Accept: "application/json",
    //       },
    //     });
    //     if (nextPageMessages) {
    //       messages.value = [...messages.value, ...nextPageMessages];
    //       // renderOrbits(true);
    //       if (nextPageMessages.length < 9) {
    //         noMoreResults.value = true;
    //       }
    //     }
    //     prefetching.value = false;
    //   }
    // }
  }
);

const container = ref(null);

const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // Months are zero-based
  const day = date.getDate();

  return `${year}-${month}-${day}`;
};

const isToday = (date: string) => {
  const dateObj = new Date(date);
  dateObj.setHours(0, 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return dateObj.getTime() === today.getTime();
};

const { data: messages } = useFetch<Message[] | null>(`https://xsrr-l2ye-dpbj.f2.xano.io/api:oUvfVMO5/receive_week?start_date=${formatDate(new Date())}`, {
  headers: {
    Accept: "application/json",
  },
});

const sizes = Array.from({ length: 10 }, (c, k) => 100 - 10 * (k + 1));

enum ScrollDirection {
  Up,
  Down,
}

const scrolling = ref(false);

const showMore = reactive<{ [key: string]: { value: number; reverse: boolean } }>({});

const isReversing = (messageIndex: number) => {
  if (!messages.value) return false;
  const message = messages.value[messageIndex];

  if (Object.keys(showMore).includes(message.contact_date)) {
    return showMore[message.contact_date].reverse;
  }

  return false;
};
const toggleShowMore = (orbitIndex: number) => {
  if (!messages.value) return;
  const message = messages.value[orbitIndex];
  const orbits = gsap.utils.toArray(".orbit") as HTMLElement[];

  const tl = gsap.timeline({
      onComplete: () => {
        scaleUpOrbs();
      },
    }),
    orbit = orbits[orbitIndex],
    orbs = Array.prototype.slice.call(orbit.getElementsByClassName("orb")) as HTMLElement[],
    path = Array.prototype.slice.call(orbit.getElementsByTagName("path")).find((item) => item.id === "orbit-arc");

  const excludeIndices = orbs
    .map((orb, orbIndex) => {
      if (orb.classList.contains("orb-center") || orb.classList.contains("orb-last")) {
        return orbIndex;
      }
      return null;
    })
    .filter((item) => item !== null);

  for (let i = 0; i < excludeIndices.length; i++) {
    orbs.splice(excludeIndices[i]!, excludeIndices.length);
  }

  const currentOrbitMessageIndex = Object.keys(showMore).includes(message.contact_date) ? showMore[message.contact_date].value : 6;

  if (!Object.keys(showMore).includes(message.contact_date)) {
    showMore[message.contact_date] = {
      value: 6,
      reverse: false,
    };
  }

  tl.to(orbs.slice(0, currentOrbitMessageIndex), {
    motionPath: {
      end: 0.5,
      path,
      align: path,
      alignOrigin: [0.5, 0.5],
    },
    duration: 1,
    opacity: 0,
    ease: "circ.out",
    onComplete: () => {
      const nextIndex = showMore[message.contact_date].reverse ? currentOrbitMessageIndex - 6 : currentOrbitMessageIndex + 6;

      const nextMessages = orbs.slice(showMore[message.contact_date].reverse ? nextIndex - 6 : currentOrbitMessageIndex - 1, nextIndex);

      const placements = getRandomPlacement(nextMessages.length + 2, 0.08, 0.52);

      placements.splice(
        placements.findIndex((placement) => placement === 0.3),
        1
      );

      placements.splice(placements[placements.length - 1], 1);

      gsap.set(nextMessages, { opacity: 0 });

      nextMessages.forEach((orb, orbIndex) => {
        tl.to(
          orb,
          {
            motionPath: {
              path: path,
              align: path,
              alignOrigin: [0.5, 0.5],
              // ...(showMore[message.contact_date].reverse ? { start: placements[orbIndex] } : {}),
              end: placements[orbIndex],
            },
            duration: 0.5,
            stagger: 0.2,
            opacity: 1,
            transformOrigin: "50% 50%",
            ease: "circ.inOut",
          },
          0
        );
      });
      if ((nextIndex === 6 && showMore[message.contact_date].reverse) || nextIndex === 0) {
        showMore[message.contact_date].reverse = false;
      }
      if (nextIndex > message.array.length) {
        showMore[message.contact_date].reverse = true;
      }
      showMore[message.contact_date].value = nextIndex;
    },
  });
};

const hiddenMessages = (messageIndex: number) => {
  if (!messages.value) return -1;
  const message = messages.value[messageIndex];
  return Object.keys(showMore).includes(message.contact_date) ? message.array.length - showMore[message.contact_date].value : message.array.length - 6;
};
const getRandomPlacement = (n: number, min: number, max: number) => {
  const points = [];
  const center = (min + max) / 2;

  if (n === 1) {
    return [center];
  }

  const step = (max - min) / (n - 1);

  for (let i = 0; i < n; i++) {
    let point = min + i * step;

    if (Math.abs(point - center) > 1e-10) {
      let randomShift;
      do {
        const shift = Math.random() * 0.0024 + 0.001;
        const direction = Math.random() < 0.5 ? -1 : 1;
        randomShift = shift * direction;
      } while (point + randomShift < min || point + randomShift > max);
      point += randomShift;
      // if(point)
    }

    points.push(point);
  }

  return points;
};

const scaleUpOrbs = (orbit?: HTMLElement) => {
  if (orbit) {
    const svg = Array.prototype.slice.call(orbit.getElementsByTagName("svg"));
    const orbs = Array.prototype.slice.call(orbit.getElementsByClassName("orb"));
    const ctm = svg[0].getCTM();
    gsap.to(orbs, {
      scaleX: 1 / ctm.a,
      scaleY: 1 / ctm.d,
      duration: 0.1,
    });
  } else {
    const orbits = gsap.utils.toArray(".orbit") as HTMLElement[];
    orbits.forEach((orbit, orbitIndex) => {
      const svg = Array.prototype.slice.call(orbit.getElementsByTagName("svg"));
      const orbs = Array.prototype.slice.call(orbit.getElementsByClassName("orb"));
      const ctm = svg[0].getCTM();
      gsap.to(orbs, {
        scaleX: 1 / ctm.a,
        scaleY: 1 / ctm.d,
        duration: 0.1,
      });
    });
  }
};

const placeOrbs = (orbits: HTMLElement[]) => {
  // gsap.registerPlugin(MotionPathPlugin);

  orbits.forEach((orbit, orbitIndex) => {
    let orbs = Array.prototype.slice.call(orbit.getElementsByClassName("orb")) as HTMLElement[],
      path = Array.prototype.slice.call(orbit.getElementsByTagName("path")).find((item) => item.id === "orbit-arc");

    if (orbs.length > 0) {
      const controls = orbs.filter((orb) => orb.classList.contains("orb-center") || orb.classList.contains("orb-last"));
      const orbsInView = [...orbs.filter((orb) => (orb.classList.contains("orb-center") || orb.classList.contains("orb-last")) === false).slice(0, 6), ...controls];
      const placement = getRandomPlacement(orbsInView.length, 0.08, 0.52).reverse();

      const indexOfDateOrb = orbs.findIndex((orb) => orb.classList.contains("orb-center"));
      if (indexOfDateOrb !== -1) {
        orbs.splice(Math.floor(orbs.length / 2), 0, orbs[indexOfDateOrb]);
        orbs.splice(indexOfDateOrb, 1);
        const indexOfCenter = placement.findIndex((item) => item === 0.3);
        if (indexOfCenter !== -1) {
          placement.splice(indexOfCenter, 1);
        }
      }
      const getPlacement = (orbIndex: number) => {
        const orb = orbsInView[orbIndex];

        if (orb.classList.contains("orb-center")) {
          return {
            start: 0.305,
            end: 0.305,
          };
        }

        if (orb.classList.contains("orb-last")) {
          placement.splice(placement.length - 1, 1);
          return {
            start: 0.08,
            end: 0.08,
          };
        }

        return {
          start: placement[orbIndex],
          end: placement[orbIndex],
        };
      };

      orbsInView.forEach((orb, orbIndex) => {
        gsap.to(orb, {
          motionPath: {
            path: path,
            align: path,
            alignOrigin: [0.5, 0.5],
            ...getPlacement(orbIndex),
          },
          duration: 0.4,
          opacity: 1,
          transformOrigin: "50% 50%",
          // ease: "power1.inOut",
        });
      });
    }
  });
  scaleUpOrbs();
};

const renderOrbits = (init = false, scrollDirection = ScrollDirection.Up) => {
  const orbits = gsap.utils.toArray(".orbit") as HTMLElement[];

  if (!init) {
    if (currentIndex.value + 1 === orbits.length && scrollDirection === ScrollDirection.Down) return;

    if (currentIndex.value === 0 && scrollDirection === ScrollDirection.Up) return;
  }
  scrolling.value = true;
  if (init) {
    orbits.forEach((orbit, orbitIndex) => {
      gsap.set(orbit, { width: `${100 - 10 * orbitIndex}%` });
    });
    const tl = gsap.timeline({
      onComplete: () => {
        setTimeout(() => placeOrbs(orbits), 400);
      },
    });
    orbits.slice(currentIndex.value, currentIndex.value + 9).forEach((orbit, orbitIndex) => {
      tl.to(orbit, {
        width: `${sizes[orbitIndex]}%`,
        stagger: 1,
        display: "block",
        duration: 0.1,
      });
    });

    scrolling.value = false;
    return;
  }
  if (scrollDirection === ScrollDirection.Down) {
    currentIndex.value++;
  } else {
    currentIndex.value--;
  }

  const tl = gsap.timeline({
    onComplete: () => {
      placeOrbs([orbits[currentIndex.value], ...(scrollDirection === ScrollDirection.Up ? [orbits[currentIndex.value + 1]] : [])]);
      setTimeout(() => {
        scrolling.value = false;
      }, 500);
    },
    smoothChildTiming: true,
  });
  orbits.forEach((orbit, orbitIndex) => {
    const width = Number(orbit.style.width.replace("%", ""));

    tl.to(
      orbit,
      {
        width: scrollDirection === ScrollDirection.Down ? (width == 0 ? "10%" : `+=10%`) : `-=10%`,
        onUpdate: () => {
          scaleUpOrbs(orbit);
        },
        onComplete: () => {
          scaleUpOrbs(orbit);
        },
        immediateRender: true,
        ease: "power1.inOut",
      },
      0
    );
  });
};

watch(
  () => container.value,
  (value) => {
    if (import.meta.client) {
      renderOrbits(true);

      gsap.registerPlugin(Observer, MotionPathPlugin);

      Observer.create({
        target: value,
        type: "wheel,touch,scroll,pointer",
        onUp: (self) => {
          if (!scrolling.value) renderOrbits(false, ScrollDirection.Up);
        },
        onDown: (self) => {
          if (!scrolling.value) renderOrbits(false, ScrollDirection.Down);
        },
      });
      window.addEventListener("resize", () => {
        const orbits = gsap.utils.toArray(".orbit") as HTMLElement[];
        placeOrbs(orbits);
      });
    }
  }
);
onBeforeUnmount(() => {
  window.removeEventListener("resize", () => {}, false);
});
</script>
<style>
html {
  @apply h-screen bg-surface overflow-hidden;
}
body,
#__nuxt {
  @apply h-full;
}
.n-popover {
  all: unset !important;
}
</style>
