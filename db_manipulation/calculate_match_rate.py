import json
import sys
import operator

def main():
    #read_path = sys.argv[0]
    read_path = 'input.json'
    data = []
    match = {}

    with open(read_path, 'r') as file:
        for line in file:
            data.append(json.loads(line))

    # delete match
    for i in range(0, len(data)):
        data[i]['match'] = {}

    # calculate match_rate for each pair of users
    for i in range(0, len(data)):
        p1 = data[i]
        p1_name = p1['name']
        for j in range(0, i):
            p2 = data[j]
            p2_name = p2['name']
            res = int((calculate(p1, p2) + calculate(p2, p1)) / 2)
            res = max(res, 0)
            p1['match'][p2_name] = {'rate': res, 'avatar': p2['avatarUrl'], 'openid': p2['_openid']}
            p2['match'][p1_name] = {'rate': res, 'avatar': p1['avatarUrl'], 'openid': p1['_openid']}
            match[(i, j)] = res

    # sort match for each user
    for i in range(0, len(data)):
        new_list = []
        for key, value in sorted(data[i]['match'].items(), key=lambda item: item[1]['rate'], reverse=True):
            value['name'] = key
            new_list.append(value)
        data[i]['match'] = new_list

    file.close()

    with open('output.json', 'w') as file:
        for line in data:
            json.dump(line, file, indent=2, ensure_ascii=False)
    file.close()

# calculate match_rate between two users
def calculate(p1, p2):
    res = 100
    # if gender does not match, return 0
    if p1['expectedGender'] != p2['gender'] or p2['expectedGender'] != p1['gender']:
        return 0

    # each unmatched merit -10
    for i in range(3):
        if p2['merits'][i] not in p1['expectedMerits']:
            res -= 10

    #each unmatched age/weight/height -20
    if not p2['age'] in range(int(p1['expectedAgeLowerBound']), int(p1['expectedAgeUpperBound']) + 1):
        res -= 20
    if not p2['height'] in range(int(p1['expectedHeightLowerBound']), int(p1['expectedHeightUpperBound']) + 1):
        res -= 20
    if not p2['weight'] in range(int(p1['expectedWeightLowerBound']), int(p1['expectedWeightUpperBound']) + 1):
        res -= 20
    return res


if __name__ == "__main__":
    main()