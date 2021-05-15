declare global {
    interface String {
        splice(start: number, delCount: number, newSubStr: string): string;
    }
}

String.prototype.splice = function (idx: number, rem: number, str: string): string {
    return this.slice(0, idx) + str + this.slice(idx + Math.abs(rem));
};

export { };
