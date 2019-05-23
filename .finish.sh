cd html
echo "working in:"
pwd
rsync -rvP *.html ../oldHTMLs
rsync -rvP *.txt ../oldHTMLs
rm -rvf *
