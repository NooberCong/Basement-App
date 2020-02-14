import React, { useState, useEffect } from 'react'

const CommentSection = (flushID, flushDispatch) => {
    const [comments, setComments] = useState([]);
    const getComments = async () => {
        const response = await axios.get(`/flushes/${flushID}/comment`);
        setComments(response.data);
    }
    useEffect(() => {
        getComments();
    }, []);
    return (
        <Dialog open={diagOpen} onClose={handleDiagClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Comments</DialogTitle>
            <DialogContent>
                {}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleDiagClose} color="primary">
                    Cancel
                        </Button>
                <Button onClick={(e) => {
                    handleDiagClose();
                    handleEdit(e);
                }} color="primary">
                    Save
                        </Button>
            </DialogActions>
        </Dialog>
    )
}