<script lang="ts">
  import {goto} from "$app/navigation";
  import {authStorePersist} from "$lib/authStore";
  import api from "$lib/api";

  // initialize with the current value
  let storeValue: any;

  // subscribe to changes in the store
  authStorePersist.subscribe((value) => {
    // update the local variable with the new value
    storeValue = value;
  });

  let property_name = "";
  let status = "";
  let price: number;
  let desc = "";
  let location = "";
  let file: FileList;

  async function submitEstate() {
    const formData = new FormData();
    if (file && file.length > 0) {
      // Append the first file
      formData.append("files.imageUrl", file[0]);
    }
    formData.append(
      "data",
      JSON.stringify({property_name, status, price, desc, location})
    );

    try {
      let response;
      response = await api.post("/estates?populate=*", formData, {
        headers: {"Content-Type": "multipart/form-data"},
      });
      // Redirect to home after submission
      goto("/");
    } catch (error: any) {
      console.error("Error creating estate", error.response);
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
      <p>Use the form below to add a new property</p>
    </div>

    <form
      on:submit|preventDefault={submitEstate}
      class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
    >
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="">
          Property Image
        </label>
        <input
          bind:files={file}
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id=""
          type="file"
          placeholder="Property Image"
        />
      </div>
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="">
          Property Name
        </label>
        <input
          bind:value={property_name}
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id=""
          type="text"
          placeholder="Property Name"
        />
      </div>
      <div class="mb-6">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="">
          Location
        </label>
        <input
          bind:value={location}
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
          id=""
          type="text"
          placeholder="Status"
        />
      </div>
      <div class="mb-6">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="">
          Status
        </label>
        <input
          bind:value={status}
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
          id=""
          type="text"
          placeholder="Status"
        />
      </div>
      <div class="mb-6">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="">
          Price in USD
        </label>
        <input
          bind:value={price}
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
          id=""
          type="number"
          placeholder="Price"
        />
      </div>
      <div class="mb-6">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="">
          Description
        </label>
        <textarea
          bind:value={desc}
          rows="5"
          class="shadow appearance-none border resize-none rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
          id=""
          placeholder="Description"
        ></textarea>
      </div>
      <div class="text-center">
        <button
          class="bg-blue-500 w-full hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="submit"
        >
          Add
        </button>
      </div>
    </form>
  </div>
{:else}
  <div class="text-center mt-20">
    <p class="mb-5">
      You are not Currently logged, To create a property please log in
    </p>
    <a
      href="/login"
      class="bg-blue-500 rounded mt-3 px-5 py-2 hover:bg-blue-700 text-white font-bold"
      >Login</a
    >
  </div>
{/if}
