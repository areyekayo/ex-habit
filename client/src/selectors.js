import { createSelector } from "@reduxjs/toolkit";
import { selectTriggerById, selectUser, selectAllTriggers, selectAllEntries } from "./features/users/userSlice";
import { selectBehaviorById, selectAllBehaviors } from "./features/behaviors/behaviorSlice";

export const selectTriggerWithBehaviors = (triggerId) => createSelector(
    // Gets a trigger and its associated behaviors
    state => selectTriggerById(state, triggerId),
    state => selectAllBehaviors(state),
    (trigger, behaviorsArray) => {
        if (!trigger) return null;

        const behaviorMap = Object.fromEntries(behaviorsArray.map(b => [b.id, b]));

        if (!trigger.behaviorIds) return trigger

        const behaviors = (trigger.behaviorIds)
            .map(id => behaviorMap[id])
            .filter(Boolean);

        return {
            ...trigger,
            behaviors
        }
    }
)

export const selectBehaviorWithEntriesByTrigger = (behaviorId, triggerId) =>
    createSelector(
        // Gets a behavior and its entries associated with a trigger
        state => selectBehaviorById(state, behaviorId),
        state => selectAllEntries(state),
        (behavior, entryEntities) => {
            if (!behavior) return null;

            const entries = Object.values(entryEntities).filter(
                entry => entry.behavior_id === behavior.id && entry.trigger_id === triggerId
            );
            return {behavior, entries}
        }
)

export const selectBehaviorsForUser = createSelector(
    // Gets a user's behaviors associated with their entries
    selectUser,
    selectAllBehaviors,
    (user, behaviorEntities) => {
        if (!user || !user.behaviorIds) return [];
        return behaviorEntities.filter(behavior => user.behaviorIds.includes(behavior.id))
    }
)

export const selectTriggersForBehavior = (behaviorId) => createSelector(
    // Gets a user's triggers associated with a behavior
    (state) => selectAllTriggers(state),
    (triggers) => Object.values(triggers).filter(
        (trigger) => trigger.behaviorIds && trigger.behaviorIds.includes(behaviorId))
)