interface Array<T> {
    /** Groups the array's element by a specified factor.
     * @param {(element: any) => U} predicate A function that takes an element and return a grouping factor.
     * @returns A map that contains all the element grouped to the specified factor.
     */
    groupBy<U>(predicate: (element: T) => U): Map<U, Array<T>>;
}

Array.prototype.groupBy = function <U>(predicate: (element: any) => U) {
    let groups: Map<U, Array<any>> = new Map();

    this.forEach(element => {
        let group: U = predicate(element);

        if (!groups.has(group)) {
            groups.set(group, [element]);
            return;
        }

        groups.set(group, [...groups.get(group) ?? [], element]);
    });

    return groups;
}