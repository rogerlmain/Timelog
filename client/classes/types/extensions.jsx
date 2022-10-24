import { is_function } from "client/classes/common";

const process_mutation = mutations => mutations.forEach (mutation => mutation.target.querySelectorAll ("*").forEach (node => { if (is_function (node.onLoad)) node.onLoad ()  }));

new MutationObserver (process_mutation).observe (document.body, { childList: true, subtree: true, attributes: true });
