
function BehaviorCard({behavior}){
    const {id, name, type, description, entries} = behavior;

    if (!behavior) return <div>Behavior not found</div>;

    return (
        <>
            <div>
                <h2>{name}</h2>
                <p>Type: {type}</p>
                <p>{description}</p>
                <h3>Entries</h3>
                {entries.map(entry => (
                        <div key={entry.id}>
                            <h4>{entry.created_timestamp}</h4>
                            <p>{entry.description}</p>
                            <p>Reward: {entry.reward}</p>
                            <p>Result: {entry.result}</p>
                            <p>Mood: {entry.mood}</p>
                        </div>
                ))}
            </div>
        </>
    )
}

export default BehaviorCard;