import { createSelector } from "@reduxjs/toolkit";
import { selectTriggerById, selectUser } from "./features/users/userSlice";
import { selectBehaviorById } from "./features/behaviors/behaviorSlice";

export const selectTriggerWithBehaviors = (triggerId) => createSelector(
    // Gets a trigger and its associated behaviors, behavior IDs, and entry IDs
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
        // Gets a behavior and its entries associated with a trigger
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

export const selectBehaviorsForUser = createSelector(
    // Gets a user's behaviors associated with their entries
    selectUser,
    (state) => state.behaviors.entities,
    (user, behaviorEntities) => {
        if (!user || !user.behaviorIds) return [];
        return user.behaviorIds.map(id => behaviorEntities[id]).filter(Boolean);
    }
)

export const selectTriggersForBehavior = (behaviorId) => createSelector(
    // Gets a user's triggers associated with a behavior
    (state) => state.user.triggers.entities,
    (triggers) => Object.values(triggers).filter(
        (trigger) => trigger.behaviorIds && trigger.behaviorIds.includes(behaviorId))
)

export const selectTriggerWithEntriesByBehavior = (behaviorId, triggerId) =>
    createSelector(
        // Gets a trigger and its entries associated with a behavior
        state => selectTriggerById(state, triggerId),
        state => state.user.entries.entities,
        (trigger, entryEntities) => {
            if(!trigger) return null;

            const entries = Object.values(entryEntities).filter(
                entry => entry.trigger_id == trigger.id && entry.behavior_id == behaviorId
            );
            return {trigger, entries}
        }
    )