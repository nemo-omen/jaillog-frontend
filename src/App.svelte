<script>
  import { parseHtml } from "./lib/parseHtml.js";

  let htmlInput = "";
  $: errorMessage = false;
  $: message = "";
  $: templateOutput = "";

  async function parseInput() {
    try {
      const temp = await parseHtml(htmlInput);
      templateOutput = temp;
    } catch (error) {
      errorMessage = true;
      message = "Something went wrong!";
    }
  }
</script>

<main>
  <div class="input">
    <label for="doc-input">HTML Input</label>
    <textarea
      name="doc-input"
      id="doc-input"
      rows="10"
      class={errorMessage ? "error" : ""}
      bind:value={htmlInput}
    />
  </div>
  <div class="input-control">
    <button on:click={parseInput}>Make Template!</button>
  </div>
  <div class="output">
    <label for="doc-input">WordPress Template</label>
    <textarea
      name="doc-output"
      id="doc-output"
      rows="10"
      bind:value={templateOutput}
    />
  </div>
  <h2>Preview</h2>
  {#if errorMessage}
    <p class="error-message">{message}</p>
  {/if}
  <div class="preview">
    {@html templateOutput}
  </div>
</main>

<style>
  :root {
    font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  }
  main {
    display: flex;
    flex-direction: column;
    padding: 2rem;
    gap: 4rem;
    width: 60%;
    margin: 4rem auto;
  }

  textarea {
    background-color: #e9e9e9;
    width: 100%;
    resize: none;
    border: none;
    box-shadow: none;
    border: 2px solid #868686;
    border-radius: 0.5rem;
    box-shadow: inset 1px 1px 3px rgba(0, 0, 0, 0.3);
    padding: 1rem;
  }

  .error {
    background-color: #ffaea0;
    border-color: tomato;
  }

  .input,
  .output {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .input label,
  .output label,
  h2 {
    padding-inline: 1rem;
    font-size: 1.5rem;
    font-weight: 600;
  }

  .input-control {
    text-align: center;
  }

  .error-message {
    color: #ff6347;
    text-align: center;
    font-size: 1.5rem;
  }

  button {
    font-size: 1.25rem;
    background-color: turquoise;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 0.5em;
    font-weight: 600;
    letter-spacing: 0.125em;
    cursor: pointer;
    box-shadow: 5px 5px 15px rgba(0, 0, 0, 0.2);
  }

  button:active {
    box-shadow: 3px 3px 10px rgba(0, 0, 0, 0.25);
  }
</style>
