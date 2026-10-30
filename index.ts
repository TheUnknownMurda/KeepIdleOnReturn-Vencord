/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { currentNotice, noticesQueue, popNotice, showNotice } from "@api/Notices";
import { definePluginSettings } from "@api/Settings";
import { getUserSettingLazy } from "@api/UserSettings";
import { Logger } from "@utils/Logger";
import definePlugin, { OptionType } from "@utils/types";

const logger = new Logger("KeepIdleOnReturn");
const StatusSettings = getUserSettingLazy<string>("status", "status")!;

const RETURN_MESSAGE = "You stayed Idle while you were away.";

const settings = definePluginSettings({
    showReturnNotice: {
        type: OptionType.BOOLEAN,
        description: "When you come back, show a banner at the top of Discord with a button to go back Online",
        default: true
    }
});

// True while you are Idle because of this plugin and have not picked another status since.
let autoIdled = false;
// True while the Idle status is being saved, so the check below does not see the old status.
let saving = false;

const isReturnNotice = (notice: any) => notice?.[1] === RETURN_MESSAGE;

function closeReturnNotice() {
    for (let i = noticesQueue.length - 1; i >= 0; i--) {
        if (isReturnNotice(noticesQueue[i])) noticesQueue.splice(i, 1);
    }
    if (isReturnNotice(currentNotice)) popNotice();
}

function showReturnNotice() {
    if (isReturnNotice(currentNotice) || noticesQueue.some(isReturnNotice)) return;

    showNotice(RETURN_MESSAGE, "Go back Online", () => {
        popNotice();
        autoIdled = false;
        if (StatusSettings.getSetting() === "idle") {
            StatusSettings.updateSetting("online").catch(e => logger.error("Could not set status to Online", e));
        }
    });
}

// If your status was changed some other way (status menu, phone, another Discord app),
// the plugin forgets its Idle and closes its banner.
function checkStatus() {
    if (!autoIdled || saving || StatusSettings.getSetting() === "idle") return;
    autoIdled = false;
    closeReturnNotice();
}

export default definePlugin({
    name: "KeepIdleOnReturn",
    description: "When Discord puts you Idle after a few minutes away, you stay Idle when you come back instead of going back Online",
    authors: [{ name: "TheUnknownMurda", id: 338163169782398977n }],
    dependencies: ["UserSettingsAPI"],
    settings,

    flux: {
        IDLE({ idle }: { idle: boolean; }) {
            if (idle) {
                // Discord only shows the automatic Idle when the chosen status is Online.
                // Saving Idle as the chosen status makes it stay after you come back.
                if (StatusSettings.getSetting() !== "online") return;

                autoIdled = saving = true;
                StatusSettings.updateSetting("idle")
                    .then(() => logger.info("Went idle automatically, status saved as Idle"))
                    .catch(e => {
                        autoIdled = false;
                        logger.error("Could not save Idle status", e);
                    })
                    .finally(() => saving = false);
                return;
            }

            checkStatus();
            if (autoIdled && settings.store.showReturnNotice) showReturnNotice();
        },

        USER_SETTINGS_PROTO_UPDATE() {
            // Wait for Discord to apply the new settings before reading the status.
            if (autoIdled) setTimeout(checkStatus, 0);
        }
    },

    stop() {
        autoIdled = false;
        closeReturnNotice();
    }
});
