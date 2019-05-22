cd html
echo "working in:"
pwd
rsync -rvP *.html ../oldHTMLs
rm -rvf *