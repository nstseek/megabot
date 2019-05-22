cd oldHTMLs
echo "working in:"
pwd
rm -rvf *
cd ../html
echo "working in:"
pwd
rm -rvf *
cd ../futureHTMLs
echo "working in:"
pwd
rsync -rvP *.html ../html