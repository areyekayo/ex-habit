import { useParams } from "react-router-dom";


function Entry(){
    const {id} = useParams();
    const entryId = parseInt(id, 10);
    
    
}