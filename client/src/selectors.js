import { createSelector } from "@reduxjs/toolkit";
import { selectTriggerById } from "./features/users/userSlice";
import { selectBehaviorById } from "./features/behaviors/behaviorSlice";

export const selectTriggerWithBehaviors = (triggerId) => createSelector(
    state => selectTriggerById(state, triggerId),
    state => state.behaviors.entities,
    (trigger, behaviorEntities) => {
        if (!trigger) return null;

        const behaviors = (trigger.behaviorIds || [])
        .map(id => behaviorEntities[id])
        .filter(Boolean);

        return {
            ...trigger,
            behaviors,
        }
    }
)

export const selectBehaviorWithEntries = (behaviorId) => createSelector(
    state => selectBehaviorById(state, behaviorId),
    state => state.user.entries.entities,
    (behavior, entryEntities) => {
        if (!behavior) return null;
        const entries = Object.values(entryEntities).filter(
            entry => entry.behavior_id === behavior.id
        );

        return {
            behavior,
            entries
        }
    }
)