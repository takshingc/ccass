stock_code=$1
currentDateTs=$(date -j -f "%Y-%m-%d" $2 "+%s")
endDateTs=$(date -j -f "%Y-%m-%d" $3 "+%s")
offset=86400

while [ "$currentDateTs" -le "$endDateTs" ]
do
  date=$(date -j -f "%s" $currentDateTs "+%Y-%m-%d")
  echo $date
  node ./scripts/import_holdings $stock_code $date
  currentDateTs=$(($currentDateTs+$offset))
done