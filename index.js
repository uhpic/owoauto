(() => {
  const { findByProps } = vendetta.metro;
  const { React, ReactNative } = vendetta.metro.common;
  const { Forms } = vendetta.ui.components;
  const { useProxy } = vendetta.storage;
  const { showToast } = vendetta.ui.toasts;
  const storage = vendetta.plugin.storage;

  const Messages = findByProps("sendMessage", "receiveMessage");
  const Rest = findByProps("getAPIBaseURL", "get");
  const { FormInput, FormSwitch, FormSection, FormRow } = Forms;
  const h = React.createElement;

  storage.channelId ??= "";
  storage.targetId ??= "";
  storage.command ??= "owo curse";
  storage.minMinutes ??= "5";
  storage.maxMinutes ??= "10";
  storage.enabled ??= true;
  storage.useRest ??= false;

  let timer;

  function send(manual) {
    if (!storage.channelId || !storage.targetId) {
      if (manual) showToast("Fill in both IDs first");
      return;
    }
    if (!storage.enabled && !manual) return;
    const content = `${storage.command} <@${storage.targetId}>`;
    try {
      if (storage.useRest) {
        Rest.post({
          url: `/channels/${storage.channelId}/messages`,
          body: { content, tts: false, nonce: String(Date.now()) },
        })
          .then(() => manual && showToast("Sent (REST)"))
          .catch((e) => showToast("REST failed: " + (e?.message || e)));
      } else {
        const r = Messages.sendMessage(storage.channelId, {
          content,
          invalidEmojis: [],
          tts: false,
          validNonShortcutEmojis: [],
        });
        if (r?.catch) r.catch((e) => showToast("Send failed: " + (e?.message || e)));
        if (manual) showToast("Sent (sendMessage)");
      }
    } catch (e) {
      showToast("Error: " + (e?.message || e));
    }
  }

  function nextDelay() {
    let min = Math.max(1, parseFloat(storage.minMinutes) || 5);
    let max = Math.max(1, parseFloat(storage.maxMinutes) || 10);
    if (max < min) [min, max] = [max, min];
    return (min + Math.random() * (max - min)) * 60 * 1000;
  }

  function loop() {
    send(false);
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
        h(FormRow, {
          label: "Send now (test)",
          onPress: () => send(true),
        }),
        h(FormSwitch, {
          label: "Enabled",
          value: storage.enabled,
          onValueChange: (v) => (storage.enabled = v),
        }),
        h(FormSwitch, {
          label: "Use REST API (try if nothing sends)",
          value: storage.useRest,
          onValueChange: (v) => (storage.useRest = v),
        }),
        h(FormInput, {
          title: "Channel ID",
          value: storage.channelId,
          onChange: (v) => (storage.channelId = v.trim()),
          keyboardType: "numeric",
        }),
        h(FormInput, {
          title: "Target user ID",
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

  return {
    onLoad() {
      loop();
    },
    onUnload() {
      clearTimeout(timer);
    },
    settings: Settings,
  };
})()
