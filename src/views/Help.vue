<template>
  <!-- //TODO Change to hyperlink method for better SEO -->
  <div class="p-6">
    <router-link to="/" class="hover:underline">← Back</router-link>
  </div>

  <div class="help-description">
    <h1>Help & Tutorial</h1>
    <p>
      This video demonstrates how to use Context Protector to replace sensitive
      information in your text using customizable rules.
    </p>
  </div>
  <div class="flex justify-center items-center min-h-screen">
    <div class="browser-window">
      <!-- Browser Header -->
      <div class="browser-header">
        <div class="browser-controls">
          <div class="control-button red"></div>
          <div class="control-button yellow"></div>
          <div class="control-button green"></div>
        </div>
        <!-- <div class="address-bar">
          <span class="address-text">https://opencode.ai/help</span>
        </div> -->
        <div class="browser-spacer"></div>
      </div>

      <!-- Browser Content -->
      <div class="browser-content">
        <video
          :src="videoSrc"
          autoplay
          playsinline
          loop
          muted
          preload="auto"
          :poster="posterSrc"
          class="video-player"
        >
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const videoSrc = "https://www.w3schools.com/html/mov_bbb.webm";
const posterSrc =
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4";
</script>

<style scoped>
.help-description {
  text-align: center;
  margin-bottom: 2rem;
}

.help-description h1 {
  font-size: 2rem;
  margin-bottom: 0.5rem;
  color: #333;
}

.help-description p {
  font-size: 1rem;
  color: #666;
}

.browser-window {
  /*width: vw;*/
  aspect-ratio: 16/9;
  min-height: 60vh;

  background: #f0f0f0;
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
  margin: 4rem;
}

.browser-header {
  height: 40px;
  background: linear-gradient(to bottom, #e0e0e0, #c0c0c0);
  display: flex;
  align-items: center;
  padding: 0 10px;
  border-bottom: 1px solid #999;
}

.browser-controls {
  display: flex;
  gap: 8px;
}

.control-button {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 1px solid #888;
}

.red {
  background: #ff5f57;
}

.yellow {
  background: #ffbd2e;
}

.green {
  background: #28ca42;
}

.address-bar {
  flex: 1;
  margin: 0 20px;
  background: white;
  border: 1px inset #ccc;
  border-radius: 4px;
  height: 24px;
  display: flex;
  align-items: center;
  padding: 0 8px;
  font-size: 12px;
  color: #666;
}

.browser-spacer {
  width: 60px;
}

.browser-content {
  flex: 1;
  background: black;
  position: relative;
}

.video-player {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
