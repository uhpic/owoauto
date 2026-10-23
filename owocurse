const { findByProps } = vendetta.metro;
const { React, ReactNative } = vendetta.metro.common;
const { Forms } = vendetta.ui.components;
const { useProxy } = vendetta.storage;
const storage = vendetta.plugin.storage;

const Messages = findByProps("sendMessage", "receiveMessage");
const { FormInput, FormSwitch, FormSection } = Forms;
const h = React.createElement;

// defaults
storage.channelId ??= "";
storage.targetId ??= "";
storage.command ??= "owo curse";
storage.minMinutes ??= "5";
storage.maxMinutes ??= "10";
storage.enabled ??= true;

let timer;

function send() {
  if (!storage.enabled || !storage.channelId || !storage.targetId) return;
  try {
    Messages.sendMessage(storage.channelId, {
      content: `${storage.command} <@${storage.targetId}>`,
      invalidEmojis: [],
      tts: false,
      validNonShortcutEmojis: [],
    });
  } catch (e) {
    console.error("[OwO Auto]", e);
  }
}

function nextDelay() {
  let min = Math.max(1, parseFloat(storage.minMinutes) || 5);
  let max = Math.max(1, parseFloat(storage.maxMinutes) || 10);
  if (max < min) [min, max] = [max, min];
  return (min + Math.random() * (max - min)) * 60 * 1000;
}

function loop() {
  send();
  timer = setTimeout(loop, nextDelay());
}

function Settings() {
  useProxy(storage);
  return h(
    ReactNative.ScrollView,
    null,
    h(
      FormSection,
      { title: "OwO Auto" },
      h(FormSwitch, {
        label: "Enabled",
        value: storage.enabled,
        onValueChange: (v) => (storage.enabled = v),
      }),
      h(FormInput, {
        title: "1492564124868284435",
        value: storage.channelId,
        onChange: (v) => (storage.channelId = v.trim()),
        keyboardType: "numeric",
      }),
      h(FormInput, {
        title: "985200963516268595",
        value: storage.targetId,
        onChange: (v) => (storage.targetId = v.trim()),
        keyboardType: "numeric",
      }),
      h(FormInput, {
        title: "Command",
        value: storage.command,
        onChange: (v) => (storage.command = v),
      }),
      h(FormInput, {
        title: "Min interval (minutes)",
        value: storage.minMinutes,
        onChange: (v) => (storage.minMinutes = v),
        keyboardType: "numeric",
      }),
      h(FormInput, {
        title: "Max interval (minutes)",
        value: storage.maxMinutes,
        onChange: (v) => (storage.maxMinutes = v),
        keyboardType: "numeric",
      })
    )
  );
}

export default {
  onLoad() {
    loop();
  },
  onUnload() {
    clearTimeout(timer);
  },
  settings: Settings,
};
