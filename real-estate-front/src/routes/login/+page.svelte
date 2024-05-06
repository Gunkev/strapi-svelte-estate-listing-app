<script lang="ts">
  import {goto} from "$app/navigation";
  import {login} from "$lib/api";
  let email = "";
  let password = "";
  let errorMessage = "";

  async function handleLogin() {
    try {
      const data = await login(email, password);

      goto("/");
    } catch (error: any) {
      errorMessage = error.message;
    }
  }
</script>

<div class="w-full max-w-xs mx-auto mt-20">
  <form
    on:submit|preventDefault={handleLogin}
    class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
  >
    <div class="mb-4">
      <label class="block text-gray-700 text-sm font-bold mb-2" for="username">
        Email
      </label>
      <input
        bind:value={email}
        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        id="email"
        type="email"
        placeholder="Email"
      />
    </div>
    <div class="mb-6">
      <label class="block text-gray-700 text-sm font-bold mb-2" for="password">
        Password
      </label>
      <input
        bind:value={password}
        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
        id="password"
        type="password"
        placeholder="******************"
      />
    </div>
    <div class="text-center">
      <button
        class="bg-blue-500 w-full hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        type="submit"
      >
        Sign In
      </button>
      {#if errorMessage}
        <p style="color: red;">{errorMessage}</p>
      {/if}
    </div>
  </form>
</div>
