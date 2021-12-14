<script>
  import { parseHtml } from "./lib/parseHtml.js";

  let htmlInput = "";
  $: templateOutput = "";

  async function parseInput() {
    // console.log(htmlInput);
    const temp = await parseHtml(htmlInput);
    templateOutput = temp;
  }
</script>

<main>
  <div class="input">
    <label for="doc-input">HTML Input</label>
    <textarea
      name="doc-input"
      id="doc-input"
      rows="10"
      bind:value={htmlInput}
    />
  </div>
  <div class="input-control">
    <button on:click={parseInput}>Do It</button>
  </div>
  <div class="output">
    <textarea
      name="doc-output"
      id="doc-output"
      rows="10"
      bind:value={templateOutput}
    />
  </div>
</main>

<style>
  main {
    display: flex;
    flex-direction: column;
    padding: 2rem;
    gap: 2rem;
    width: 60%;
    margin: 0 auto;
  }

  textarea {
    background-color: #e9e9e9;
    width: 100%;
  }

  .input-control {
    text-align: center;
  }
</style>
