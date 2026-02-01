import { createSelector } from "@reduxjs/toolkit";
import { selectTriggerById } from "./features/users/userSlice";
import { selectBehaviorById } from "./features/behaviors/behaviorSlice";

export const selectTriggerWithBehaviors = (triggerId) => createSelector(
    state => selectTriggerById(state, triggerId),
    (state) => state.user.triggers.entities[triggerId]?.entryIds || [],
    (state) => state.user.triggers.entities[triggerId]?.behaviorIds || [],
    state => state.behaviors.entities,
    (trigger, entryIds, behaviorIds, behaviorEntities,) => {
        if (!trigger) return null;

        const behaviors = (trigger.behaviorIds || [])
        .map(id => behaviorEntities[id])
        .filter(Boolean);

        return {
            ...trigger,
            behaviors,
            entryIds,
            behaviorIds,
        }
    }
)

export const selectBehaviorWithEntriesByTrigger = (behaviorId, triggerId) =>
    createSelector(
        state => selectBehaviorById(state, behaviorId),
        state => state.user.entries.entities,
        (behavior, entryEntities) => {
            if (!behavior) return null;

            const entries = Object.values(entryEntities).filter(
                entry => entry.behavior_id == behavior.id && entry.trigger_id == triggerId
            );

            return {behavior, entries}
        }
)