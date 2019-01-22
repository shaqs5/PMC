import re

filename = ['w_data.dat', 'soccer.dat']
minDiff = []
dispVals = []

def read_weather_file(datafile, colindex):
    with open(datafile, "r") as f:
        for _ in range(4):
            next(f)
        f.readline()
        next(f)

        # Loop through the rows in the file and get difference between min and max, append min diff to the list\
        # also get corresponding display values.
        for line in f:
            if line.split()[0].isnumeric() == False:
                continue
            maxTemp = int(re.sub("\D", "", line.split()[colindex['maxcolidx']]))
            minTemp = int(re.sub("\D", "", line.split()[colindex['mincolidx']]))
            disp_val = int(re.sub("\D", "", line.split()[colindex['dispcolidx']]))
            minSpread = abs(maxTemp - minTemp)
            minDiff.append(minSpread)
            dispVals.append(disp_val)


def read_soccer_file(datafile, colindex):
    with open(datafile, "r") as f:
        for _ in range(2):
            next(f)
        next(f)

        # Loop through the rows in the file and get difference between min and max, append min diff to the list\
        # also get corresponding display values.
        for line in f:
            if line.find('---') != -1 or line.find('</pre>') != -1:
                continue
            maxTemp = int(line.split()[colindex['maxcolidx']])
            minTemp = int(line.split()[colindex['mincolidx']])
            disp_val = line.split()[colindex['dispcolidx']]
            minSpread = abs(maxTemp - minTemp)
            minDiff.append(minSpread)
            dispVals.append(disp_val)


def get_min_diff(datafile, colindex):
    if datafile == filename[0]:
        read_weather_file(datafile, colindex)
    elif datafile == filename[1]:
        read_soccer_file(datafile, colindex)

    minVal = minDiff[0]
    for i in range(0, len(minDiff), 1):
        minVal = min(minVal, minDiff[i])

    dispval = dispVals[minDiff.index(minVal)]

    return [dispval, minVal]


if (__name__ == "__main__"):
    while True:
        option = input('Enter 1 for Weather Results or 2 for Soccer Results:')
        if option == "1":
            w_result = get_min_diff(filename[0], {'dispcolidx': 0, 'maxcolidx': 1, 'mincolidx': 2})
            final_stmt = 'Day {} has the smallest temperature spread, with {} degree(s) difference.\n' \
                .format(str(w_result[0]), str(w_result[1]))
            print(final_stmt)
            minDiff.clear()
            dispVals.clear()
        elif option == "2":
            s_result = get_min_diff(filename[1], {'dispcolidx': 1, 'maxcolidx': 6, 'mincolidx': 8})
            final_stmt = '{} has the smallest difference in ‘For’ and ‘Against’ goals, with a difference of {} goal(s).\n' \
                .format(str(s_result[0]), str(s_result[1]))
            print(final_stmt)
            minDiff.clear()
            dispVals.clear()
