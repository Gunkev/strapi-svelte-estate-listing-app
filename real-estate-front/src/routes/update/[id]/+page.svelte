<script lang="ts">
  import {onMount} from "svelte";
  import {page} from "$app/stores";
  import {getEstateById, updateEstate} from "$lib/api";
  import {goto} from "$app/navigation";
  import {authStorePersist} from "$lib/authStore";
  import {get} from "svelte/store";

  let storeValue;
  let selectedFile: File | null = null;

  // initialize with the current value
  $: storeValue = get(authStorePersist);

  let estateId = $page.params.id;
  let estate = {
    property_name: "",
    status: "",
    file: FileList,
    price: "",
    location: "",
    desc: "",
  };

  // Load the estate data when the component mounts
  onMount(async () => {
    const response = await getEstateById(estateId);
    if (response.attributes) {
      estate = {...response.attributes};
    }
  });

  // Handle form submission for update
  async function handleSubmit() {
    const formData = new FormData();
    formData.append(
      "data",
      JSON.stringify({
        property_name: estate.property_name,
        status: estate.status,
        price: estate.price,
        location: estate.location,
        desc: estate.desc,
      })
    );
    if (estate.file instanceof File) {
      formData.append("files.imageUrl", estate.file, estate.file.name);
    }

    try {
      await updateEstate(estateId, formData);

      goto("/");
    } catch (error) {
      console.error("Error updating estate:", error);
      alert("Failed to update estate.");
    }
  }

  function handleFileChange(event: Event) {
    // Correctly type the event target
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      // Access the first file
      selectedFile = input.files[0];
    } else {
      // No file selected
      selectedFile = null;
    }
  }
</script>

{#if storeValue.isAuthenticated}
  <div class="w-full mx-auto mt-5">
    <div class="mb-5 text-center">
      <h1 class="text-center">
        Welcome <span class="text-blue-500 capitalize"
          >{storeValue.user?.username}</span
        >
      </h1>
      <p>Use the form below to edit {estate.property_name}</p>
    </div>

    <form
      on:submit|preventDefault={handleSubmit}
      class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
    >
      <div class="mb-4">
        <label
          class="block text-gray-700 text-sm font-bold mb-2"
          for="propertyImage"
        >
          Property Image
        </label>
        <input
          on:change={handleFileChange}
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="propertyImage"
          type="file"
          placeholder="Property Image"
        />
      </div>
      <div class="mb-4">
        <label
          class="block text-gray-700 text-sm font-bold mb-2"
          for="propertyName"
        >
          Property Name
        </label>
        <input
          bind:value={estate.property_name}
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="propertyName"
          type="text"
          placeholder="Property Name"
        />
      </div>
      <div class="mb-6">
        <label
          class="block text-gray-700 text-sm font-bold mb-2"
          for="propertyLocation"
        >
          Location
        </label>
        <input
          bind:value={estate.location}
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
          id="propertyLocation"
          type="text"
          placeholder="Status"
        />
      </div>
      <div class="mb-6">
        <label
          class="block text-gray-700 text-sm font-bold mb-2"
          for="propertyStatus"
        >
          Status
        </label>
        <input
          bind:value={estate.status}
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
          id="propertyStatus"
          type="text"
          placeholder="Status"
        />
      </div>
      <div class="mb-6">
        <label
          class="block text-gray-700 text-sm font-bold mb-2"
          for="propertyPrice"
        >
          Price in USD
        </label>
        <input
          bind:value={estate.price}
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
          id="propertyPrice"
          type="number"
          placeholder="Price"
        />
      </div>
      <div class="mb-6">
        <label
          class="block text-gray-700 text-sm font-bold mb-2"
          for="propertyDesc"
        >
          Description
        </label>
        <textarea
          bind:value={estate.desc}
          rows="5"
          class="shadow appearance-none border resize-none rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
          id="propertyDesc"
          placeholder="Description"
        ></textarea>
      </div>
      <div class="text-center">
        <button
          class="bg-blue-500 w-full hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="submit"
        >
          Update
        </button>
      </div>
    </form>
  </div>
{/if}
