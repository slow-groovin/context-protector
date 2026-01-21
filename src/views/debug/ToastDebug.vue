<template>
  <div class="min-h-screen bg-gray-100 py-8">
    <div class="max-w-4xl mx-auto px-4">
      <h1 class="text-3xl font-bold text-gray-800 mb-8">
        Vue-Sonner Toast Debug
      </h1>

      <div class="space-y-6">
        <!-- Basic Toasts -->
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-xl font-semibold mb-4">Basic Toasts</h2>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
            <button
              @click="showSuccess"
              class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Success
            </button>
            <button
              @click="showError"
              class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Error
            </button>
            <button
              @click="showInfo"
              class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Info
            </button>
            <button
              @click="showWarning"
              class="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
            >
              Warning
            </button>
          </div>
        </div>

        <!-- Toast with Options -->
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-xl font-semibold mb-4">Toast with Options</h2>
          <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
            <button
              @click="showWithDuration"
              class="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
            >
              10s Duration
            </button>
            <button
              @click="showWithAction"
              class="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600"
            >
              With Action
            </button>
            <button
              @click="showWithCancel"
              class="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              With Cancel
            </button>
          </div>
        </div>

        <!-- Custom Toasts -->
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-xl font-semibold mb-4">Custom Toasts</h2>
          <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
            <button
              @click="showCustom"
              class="bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600"
            >
              Custom Icon
            </button>
            <button
              @click="showRichContent"
              class="bg-teal-500 text-white px-4 py-2 rounded hover:bg-teal-600"
            >
              Rich Content
            </button>
            <button
              @click="showLoading"
              class="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
            >
              Loading
            </button>
          </div>
        </div>

        <!-- Promise Toasts -->
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-xl font-semibold mb-4">Promise Toasts</h2>
          <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
            <button
              @click="showPromiseSuccess"
              class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Promise Success
            </button>
            <button
              @click="showPromiseError"
              class="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Promise Error
            </button>
            <button
              @click="showAsyncOperation"
              class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Async Operation
            </button>
          </div>
        </div>

        <!-- Toast Control -->
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-xl font-semibold mb-4">Toast Control</h2>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
            <button
              @click="dismissAll"
              class="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
            >
              Dismiss All
            </button>
            <button
              @click="showMultiple"
              class="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
            >
              Show Multiple
            </button>
            <button
              @click="showPersistent"
              class="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Persistent
            </button>
            <button
              @click="showPositioned"
              class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Positioned
            </button>
          </div>
        </div>

        <!-- Interactive Demo -->
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-xl font-semibold mb-4">Interactive Demo</h2>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Custom Message:
              </label>
              <input
                v-model="customMessage"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your custom message"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Toast Type:
              </label>
              <select
                v-model="selectedType"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="success">Success</option>
                <option value="error">Error</option>
                <option value="info">Info</option>
                <option value="warning">Warning</option>
              </select>
            </div>
            <button
              @click="showCustomToast"
              class="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Show Custom Toast
            </button>
          </div>
        </div>

        <!-- Navigation -->
        <div class="bg-white rounded-lg shadow p-6">
          <router-link
            to="/debug"
            class="text-blue-600 hover:text-blue-800 font-medium"
          >
            ← Back to Debug Menu
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { toast } from "vue-sonner";

const customMessage = ref("Hello, this is a custom toast message!");
const selectedType = ref("success");

// Basic Toasts
const showSuccess = () => {
  toast.success("Operation completed successfully!");
};

const showError = () => {
  toast.error("An error occurred while processing your request.");
};

const showInfo = () => {
  toast.info("Here is some useful information for you.");
};

const showWarning = () => {
  toast.warning("Please be careful with this action.");
};

// Toast with Options
const showWithDuration = () => {
  toast.success("This toast will stay for 10 seconds", {
    duration: 10000,
  });
};

const showWithAction = () => {
  toast("Do you want to continue?", {
    action: {
      label: "Continue",
      onClick: () => toast.success("Action confirmed!"),
    },
  });
};

const showWithCancel = () => {
  toast("Are you sure you want to delete this?", {
    cancel: {
      label: "Cancel",
      onClick: () => toast.info("Action cancelled"),
    },
    action: {
      label: "Delete",
      onClick: () => toast.success("Item deleted"),
    },
  });
};

// Custom Toasts
const showCustom = () => {
  toast("Custom toast with icon", {});
};

const showRichContent = () => {
  toast(
    `<div>
      <div class="font-bold">Rich Content Toast</div>
      <div class="text-sm text-gray-600">
        This toast contains <strong>bold text</strong>, <em>italic text</em>,
        and other HTML elements.
      </div>
    </div>`,
    {
      // icon: "📝",
    },
  );
};

const showLoading = () => {
  const id = toast.loading("Processing your request...");

  setTimeout(() => {
    toast.success("Request completed!", { id });
  }, 2000);
};

// Promise Toasts
const showPromiseSuccess = () => {
  const promise = new Promise((resolve) => {
    setTimeout(() => resolve("Data loaded successfully!"), 2000);
  });

  toast.promise(promise, {
    loading: "Loading data...",
    success: (data: any) => `✅ ${data}`,
    error: "Failed to load data",
  });
};

const showPromiseError = () => {
  const promise = new Promise((resolve, reject) => {
    setTimeout(() => reject(new Error("Network error")), 2000);
  });

  toast.promise(promise, {
    loading: "Connecting to server...",
    success: "Connected successfully!",
    error: "❌ Failed to connect to server",
  });
};

const showAsyncOperation = () => {
  const asyncOperation = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    return "Async operation completed!";
  };

  toast.promise(asyncOperation(), {
    loading: "Performing async operation...",
    success: (result: any) => result,
    error: "Async operation failed",
  });
};

// Toast Control
const dismissAll = () => {
  toast.dismiss();
  toast.info("All toasts dismissed");
};

const showMultiple = () => {
  toast.success("First toast");
  setTimeout(() => toast.info("Second toast"), 500);
  setTimeout(() => toast.warning("Third toast"), 1000);
  setTimeout(() => toast.error("Fourth toast"), 1500);
};

const showPersistent = () => {
  toast.warning("This toast will not dismiss automatically", {
    duration: Infinity,
  });
};

const showPositioned = () => {
  toast.info("This toast uses default positioning (top-center)");
};

// Interactive Demo
const showCustomToast = () => {
  const message = customMessage.value || "Default message";
  const type = selectedType.value as "success" | "error" | "info" | "warning";

  toast[type](message, {
    duration: 3000,
    // icon:
    //   type === "success"
    //     ? "✅"
    //     : type === "error"
    //       ? "❌"
    //       : type === "warning"
    //         ? "⚠️"
    //         : "ℹ️",
  });
};
</script>
