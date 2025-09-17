class Solution(object):
    def removeDuplicates(self, nums):
        n = len(nums)
        unique_nums = []
        seen = set()
        for num in nums:
            if num not in seen:
                unique_nums.append(num)
                seen.add(num)
        unique_count = len(unique_nums)
        for i in range(unique_count):
            nums[i] = unique_nums[i]
        for i in range(unique_count, n):
            nums[i] = "_"

        return unique_count