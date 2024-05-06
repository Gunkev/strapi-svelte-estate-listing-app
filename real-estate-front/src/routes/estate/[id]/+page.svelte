<script lang="ts">
  import {getEstateById} from "$lib/api.js";
  import {page} from "$app/stores";
  import {onMount} from "svelte";

  let estateId = $page.params.id;
  export let estate: any;
  onMount(async function () {
    const estates = await getEstateById(estateId);
    if (estates) {
      estate = estates;
    } else {
      estate = {};
    }
  });
</script>

{#if estate?.attributes}
  <div class="mt-5 mb-20">
    <h1 class="mb-3">{estate.attributes.property_name}</h1>
    <div class="img_content mb-5 mx-auto">
      <img
        src={`http://localhost:1337${estate.attributes.imageUrl.data?.attributes.url}`}
        alt={estate.attributes.imageUrl.data.alternativeText}
      />
    </div>
    <p class="text-red-500">
      Price: $<span class="font-bold">{estate.attributes.price}</span>
    </p>
    <p class="text-red-500">
      Status: <span class="font-bold"> {estate.attributes.status}</span>
    </p>
    <p class="text-red-500">
      Location: <span class="font-bold"> {estate.attributes.location}</span>
    </p>

    <div class="mt-10">{estate.attributes.desc}</div>
  </div>
{/if}

<style>
  .img_content {
    background-color: blue;
    position: relative;
    height: 500px;
    width: 100%;
  }

  .img_content img {
    object-fit: cover;
    height: 500px;
    width: 100%;
  }
</style>
