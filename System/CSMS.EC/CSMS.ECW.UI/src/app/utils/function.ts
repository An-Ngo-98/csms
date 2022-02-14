export const sortByDate = (a, b) => {
    return new Date(b.votedDate).getTime() - new Date(a.votedDate).getTime();
};
