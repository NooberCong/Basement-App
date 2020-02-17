import React, { createContext, useReducer, useContext } from 'react';
const initialState = {
    all: [],
    specific: {}
}

const flushContext = createContext();

const reducer = (state, action) => {
    switch (action.type) {
        case 'SET_ALL_FLUSHES':
            return {
                ...state,
                all: action.payload
            };
        case 'LIKE_FLUSH':
            return {
                ...state,
                all: state.all.map(flush => flush.flushID === action.payload.flushID
                    ? { ...flush, likeCount: action.payload.likeCount, likedByUser: true }
                    : flush)
            }
        case 'UNLIKE_FLUSH':
            return {
                ...state,
                all: state.all.map(flush => flush.flushID === action.payload.flushID
                    ? { ...flush, likeCount: action.payload.likeCount, likedByUser: false }
                    : flush)
            }
        case 'DELETE_FLUSH':
            return {
                ...state,
                all: state.all.filter(flush => flush.flushID !== action.payload)
            }
        case 'POST_FLUSH':
            return {
                ...state,
                all: [{...action.payload, comments: []}, ...state.all]
            }
        case 'UPDATE_FLUSH':
            return {
                ...state,
                all: state.all.map(flush => flush.flushID === action.payload.flushID ? { ...flush, ...action.payload.updates } : flush)
            }
        case 'POST_COMMENT':
            return {
                ...state,
                all: state.all.map(flush => flush.flushID === action.payload.flushID
                    ? { ...flush, comments: [...(flush.comments || []), { ...action.payload.comment, replyCount: 0, likeCount: 0, replies: [] }], commentCount: flush.commentCount + 1 }
                    : flush)
            }
        case 'DELETE_COMMENT':
            return {
                ...state,
                all: state.all.map(flush => flush.flushID === action.payload.flushID
                    ? { ...flush, comments: flush.comments.filter(comment => comment.commentID !== action.payload.commentID), commentCount: flush.commentCount - 1 }
                    : flush)
            }
        case 'UPDATE_COMMENT':
            return {
                ...state,
                all: state.all.map(flush => flush.flushID === action.payload.flushID
                    ? {
                        ...flush, comments: flush.comments.map(comment => comment.commentID === action.payload.commentID
                            ? { ...comment, ...action.payload.comment }
                            : comment)
                    }
                    : flush)
            }
        case 'LIKE_COMMENT':
            return {
                ...state,
                all: state.all.map(flush => flush.flushID === action.payload.flushID
                    ? {
                        ...flush, comments: flush.comments.map(comment => comment.commentID === action.payload.commentID
                            ? { ...comment, ...action.payload, likedByUser: true }
                            : comment)
                    }
                    : flush)
            }
        case 'UNLIKE_COMMENT':
            return {
                ...state,
                all: state.all.map(flush => flush.flushID === action.payload.flushID
                    ? {
                        ...flush, comments: flush.comments.map(comment => comment.commentID === action.payload.commentID
                            ? { ...comment, ...action.payload, likedByUser: false }
                            : comment)
                    }
                    : flush)
            }
        case 'REPLY_COMMENT':
            return {
                ...state,
                all: state.all.map(flush => flush.flushID === action.payload.flushID
                    ? {
                        ...flush, comments: flush.comments.map(comment => comment.commentID === action.payload.commentID
                            ? { ...comment, replyCount: comment.replyCount + 1, replies: [...comment.replies, action.payload.reply] }
                            : comment)
                    }
                    : flush)
            }
        case 'SET_REPLIES':
            return {
                ...state,
                all: state.all.map(flush => flush.flushID === action.payload.flushID
                    ? {
                        ...flush, comments: flush.comments.map(comment => comment.commentID === action.payload.commentID
                            ? { ...comment, replies: action.payload.replies }
                            : comment)
                    }
                    : flush)
            }
        case 'LIKE_REPLY':
            return {
                ...state,
                all: state.all.map(flush => flush.flushID === action.payload.flushID
                    ? {
                        ...flush, comments: flush.comments.map(comment => comment.commentID === action.payload.reply.commentID
                            ? {
                                ...comment, replies: comment.replies.map(reply => reply.replyID === action.payload.reply.replyID
                                    ? { ...action.payload.reply, likedByUser: true }
                                    : reply)
                            }
                            : comment)
                    }
                    : flush)
            }
        case 'UNLIKE_REPLY':
            return {
                ...state,
                all: state.all.map(flush => flush.flushID === action.payload.flushID
                    ? {
                        ...flush, comments: flush.comments.map(comment => comment.commentID === action.payload.reply.commentID
                            ? {
                                ...comment, replies: comment.replies.map(reply => reply.replyID === action.payload.reply.replyID
                                    ? { ...action.payload.reply, likedByUser: false }
                                    : reply)
                            }
                            : comment)
                    }
                    : flush)
            }
        case 'DELETE_REPLY':
            return {
                ...state,
                all: state.all.map(flush => flush.flushID === action.payload.flushID
                    ? {
                        ...flush, comments: flush.comments.map(comment => comment.commentID === action.payload.reply.commentID
                            ? { ...comment, replies: comment.replies.filter(reply => reply.replyID !== action.payload.replyID) }
                            : comment)
                    }
                    : flush)
            }
        case 'UPDATE_REPLY':
            return {
                ...state,
                all: state.all.map(flush => flush.flushID === action.payload.flushID
                    ? {
                        ...flush, comments: flush.comments.map(comment => comment.commentID === action.payload.reply.commentID
                            ? { ...comment, replies: comment.replies.map(reply => reply.replyID === action.payload.replyID
                                ? {...reply, ...action.payload.reply}
                                : reply)}
                            : comment)
                    }
                    : flush)
            }
        default: return state;
    }
}

export const FlushProvider = ({ children }) => {
    const contextValue = useReducer(reducer, initialState);
    return (
        <flushContext.Provider value={contextValue}>
            {children}
        </flushContext.Provider>
    );
}

export const useFlush = () => {
    const contextValue = useContext(flushContext);
    if (!contextValue) throw Error('Used outside of provider');
    return contextValue;
}