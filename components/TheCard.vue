<template>
  <section class="p-[1px] rounded-2xl bg-cover bg-center bg-gradient-to-b from-[#7b7b7b] to-transparent">
    <section class="rounded-2xl" style="background: rgba(10, 10, 10, 0.65)">
      <section class="rounded-2xl rounded-b-none p-[10px] bg-[#0a0a0a] flex items-center gap-[15px] text-white">
        <section>
          <img class="h-[100px] w-[100px] rounded-full transition-all duration-500 ease-in-out hover:border-t-2 border-white cursor-pointer object-cover" v-lazy="message.img" />
        </section>
        <section class="flex flex-col gap-1">
          <h4 class="font-bold">{{ message.name }}</h4>
          <p>{{ message.position }}</p>
          <p>{{ message.city }}</p>
          <section class="flex items-center">
            <section class="flex items-center cursor-pointer">
              <img v-for="i in 4" v-lazy="`/user${i}.png`" class="h-5 w-5 object-cover border-[#929292] rounded-full -ml-[2%]" />
            </section>
            <p class="text-xs max-w-48">Peter Swage, John Eremic, and 281 other mutual connections</p>
          </section>
        </section>
      </section>
      <section class="p-[10px]">
        <section class="bg-[#0a0a0a]/65 overflow-hidden rounded-[10px]">
          <section class="bg-[#171717] flex gap-[10px] p-3">
            <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M3 7.75C3 7.21957 3.21071 6.71086 3.58579 6.33579C3.96086 5.96071 4.46957 5.75 5 5.75H19C19.5304 5.75 20.0391 5.96071 20.4142 6.33579C20.7893 6.71086 21 7.21957 21 7.75M3 7.75V17.75C3 18.2804 3.21071 18.7891 3.58579 19.1642C3.96086 19.5393 4.46957 19.75 5 19.75H19C19.5304 19.75 20.0391 19.5393 20.4142 19.1642C20.7893 18.7891 21 18.2804 21 17.75V7.75M3 7.75L12 13.75L21 7.75"
                stroke="white"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <p class="text-white">Reply from {{ message.name }}</p>
          </section>
          <section v-if="message._orbits_last_message" class="p-[10px] flex flex-col gap-[10px]">
            <section class="flex justify-between items-center">
              <p class="text-[#929292] text-sm">
                {{
                  new Intl.DateTimeFormat("en-GB", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                    hour12: true,
                    timeZoneName: "shortOffset",
                  }).format(new Date(createdAt))
                }}
              </p>
              <p class="text-[#929292] text-sm"><timeago :datetime="createdAt"></timeago></p>
            </section>
            <section>
              <h5 class="capitalize font-bold text-white">{{ message._orbits_last_message.message_head }}</h5>
              <p class="line-clamp-1 font-light text-white" :class="{ 'line-clamp-1': `${message.id}` !== readMore, 'line-clamp-none': `${message.id}` === readMore }">
                {{ message._orbits_last_message.message }}
              </p>
            </section>
            <button @click="toggleReadMore()" class="flex gap-1 transition-all duration-500 ease-in-out">
              <span class="font-light text-white"> {{ readMore === `${message.id}` ? "Less" : "More" }} </span>
              <svg width="24" height="25" viewBox="0 0 24 25" :class="readMore === `${message.id}` ? 'rotate-180' : ''" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 9.75L12 15.75L18 9.75" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </button>
          </section>
        </section>
      </section>
    </section>
  </section>
</template>
<script setup lang="ts">
import { PropType } from "vue";

const props = defineProps({
  message: {
    type: Object as PropType<MessageInfo>,
    required: true,
  },
  createdAt: {
    type: String,
    required: true,
  },
});

const readMore = ref("");

const toggleReadMore = () => {
  if (!readMore.value) {
    readMore.value = `${props.message.id}`;
  } else {
    readMore.value = "";
  }
};
</script>
