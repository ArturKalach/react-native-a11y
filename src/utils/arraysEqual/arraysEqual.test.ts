import { arraysEqual } from "./arraysEqual"

describe('Arrays equality', () => {
    it('should compare two arrays', () => {
        const obj = {};
        expect(arraysEqual([], [])).toBeTruthy()
        expect(arraysEqual([1,2], [1,2])).toBeTruthy()        
        expect(arraysEqual([1,obj], [1,obj])).toBeTruthy()
        
        expect(arraysEqual([1,2], [1])).toBeFalsy()
        expect(arraysEqual([1,2], [2,1])).toBeFalsy()
        expect(arraysEqual([1,obj], [1,{}])).toBeFalsy()
    })
})