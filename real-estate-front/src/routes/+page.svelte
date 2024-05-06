<script lang="ts">
  import {onMount} from "svelte";
  import {deleteEstateById, getPaginatedEstates} from "$lib/api";

  import {goto} from "$app/navigation";
  import {authStorePersist} from "$lib/authStore";
  import {get} from "svelte/store";

  // initialize with the current value
  let storeValue: any;

  // subscribe to changes in the store
  authStorePersist.subscribe((value) => {
    // update the local variable with the new value
    storeValue = value;
  });

  let estates: any[] = [];
  let currentPage = 1;
  let pageSize = 5;
  let pageCount = 0;
  let totalEstates = 0;

  async function loadEstates() {
    try {
      const result = await getPaginatedEstates(currentPage, pageSize);

      if (result.data.data && Array.isArray(result.data.data)) {
        estates = result.data.data;
        if (result.pagination) {
          pageSize = result.pagination.pageSize;
          pageCount = result.pagination.pageCount;
          totalEstates = result.pagination.total;
        } else {
          console.error("Pagination data is missing");
        }
      } else {
        throw new Error("Data is not an array or undefined");
      }
    } catch (error: any) {
      console.error("Failed to fetch estates:", error.message);
      // Set to empty array on error
      estates = [];
    }
  }

  function goToPage(page: number) {
    if (page > 0 && page <= pageCount) {
      currentPage = page;
      loadEstates();
    }
  }

  // Function to handle page changes

  function editProperty(id: string) {
    // Navigate to the edit form with id
    goto(`/update/${id}`);
  }

  async function handleDelete(id: string) {
    try {
      const isSuccess = await deleteEstateById(id);
      if (isSuccess) {
        estates = estates.filter((estate) => estate.id !== id);
      } else {
        console.error("Failed to delete estate");
      }
    } catch (error) {
      console.error("Error deleting estate:", error);
    }
  }
  // Initially load posts
  onMount(() => {
    loadEstates();
  });
</script>

<h1 class="text-center text-3xl font-bold text-blue-500">
  Real-Estate Listing
</h1>

<div class="my-4 flex justify-between items-center">
  <nav class="flex items-center">
    <button
      class="mr-10 bg-gray-300 rounded px-3 py-2 text-[12px]"
      on:click={() => goToPage(currentPage - 1)}
      disabled={currentPage <= 1}>&#8592; Previous</button
    >
    <button
      class=" bg-gray-300 rounded px-3 py-2 text-[12px]"
      on:click={() => goToPage(currentPage + 1)}
      disabled={currentPage >= pageCount}>Next &#8594;</button
    >
  </nav>

  {#if storeValue.isAuthenticated}
    <a
      href="/create"
      class="bg-blue-500 rounded px-5 py-2 hover:bg-blue-700 text-white font-bold"
      >Add Properties</a
    >
  {/if}
</div>

<main>
  {#if estates}
    <div class="grid grid-cols-3 mb-4 gap-10">
      {#each estates as estate}
        <a href={`/estate/${estate.id}`} class="mb-5 mt-10">
          <div class="img_content mb-5">
            <img
              src={`http://localhost:1337${estate.attributes.imageUrl.data?.attributes.url}`}
              alt={estate.attributes.imageUrl.data.alternativeText}
            />
          </div>
          <p class="text-blue-500 font-bold">$ {estate.attributes.price}</p>
          <p class="text-blue-500">{estate.attributes.property_name}</p>
          <p class="text-blue-500">{estate.attributes.status}</p>
          <p class="text-blue-500">At {estate.attributes.location}</p>
          {#if storeValue.isAuthenticated}
            <div class="grid grid-cols-2 mt-2 text-center gap-2">
              <a
                href={`/update/${estate.id}`}
                on:click={() => editProperty(estate.id)}
                class="bg-blue-500 rounded px-5 py-2 hover:bg-blue-700 text-white font-bold"
                >Update</a
              >
              <a
                href=""
                on:click|preventDefault={() => handleDelete(estate.id)}
                class="bg-red-500 rounded px-5 py-2 hover:bg-red-700 text-white font-bold"
                >Delete</a
              >
            </div>
          {/if}
        </a>
      {/each}
    </div>
  {:else}
    <p>No Estates found found.</p>
  {/if}
</main>

<style>
  .img_content {
    background-color: blue;
    position: relative;
    height: 300px;
    width: 300px;
  }

  .img_content img {
    object-fit: cover;
    height: 300px;
    width: 300px;
  }
</style>
