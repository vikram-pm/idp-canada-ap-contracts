// IDP web demo engine. Generated from the production code in /src (app.js, validate.js).
// The rules engine and reviewer UI below are the same code that runs in n8n.
// AI responses for the 8 sample documents are recorded (simulated from the test-pack ground truth).
const SAMPLES = {"01_INV-88912_Boreal_QC_FR.pdf":{"pdf":"JVBERi0xLjMKJZOMi54gUmVwb3J0TGFiIEdlbmVyYXRlZCBQREYgZG9jdW1lbnQgKG9wZW5zb3VyY2UpCjEgMCBvYmoKPDwKL0YxIDIgMCBSIC9GMiAzIDAgUiAvRjMgNCAwIFIKPj4KZW5kb2JqCjIgMCBvYmoKPDwKL0Jhc2VGb250IC9IZWx2ZXRpY2EgL0VuY29kaW5nIC9XaW5BbnNpRW5jb2RpbmcgL05hbWUgL0YxIC9TdWJ0eXBlIC9UeXBlMSAvVHlwZSAvRm9udAo+PgplbmRvYmoKMyAwIG9iago8PAovQmFzZUZvbnQgL0hlbHZldGljYS1Cb2xkIC9FbmNvZGluZyAvV2luQW5zaUVuY29kaW5nIC9OYW1lIC9GMiAvU3VidHlwZSAvVHlwZTEgL1R5cGUgL0ZvbnQKPj4KZW5kb2JqCjQgMCBvYmoKPDwKL0Jhc2VGb250IC9IZWx2ZXRpY2EtT2JsaXF1ZSAvRW5jb2RpbmcgL1dpbkFuc2lFbmNvZGluZyAvTmFtZSAvRjMgL1N1YnR5cGUgL1R5cGUxIC9UeXBlIC9Gb250Cj4+CmVuZG9iago1IDAgb2JqCjw8Ci9Db250ZW50cyA5IDAgUiAvTWVkaWFCb3ggWyAwIDAgNjEyIDc5MiBdIC9QYXJlbnQgOCAwIFIgL1Jlc291cmNlcyA8PAovRm9udCAxIDAgUiAvUHJvY1NldCBbIC9QREYgL1RleHQgL0ltYWdlQiAvSW1hZ2VDIC9JbWFnZUkgXQo+PiAvUm90YXRlIDAgL1RyYW5zIDw8Cgo+PiAKICAvVHlwZSAvUGFnZQo+PgplbmRvYmoKNiAwIG9iago8PAovUGFnZU1vZGUgL1VzZU5vbmUgL1BhZ2VzIDggMCBSIC9UeXBlIC9DYXRhbG9nCj4+CmVuZG9iago3IDAgb2JqCjw8Ci9BdXRob3IgKGFub255bW91cykgL0NyZWF0aW9uRGF0ZSAoRDoyMDI2MTAwOTEzNTkwNSswMCcwMCcpIC9DcmVhdG9yIChhbm9ueW1vdXMpIC9LZXl3b3JkcyAoKSAvTW9kRGF0ZSAoRDoyMDI2MTAwOTEzNTkwNSswMCcwMCcpIC9Qcm9kdWNlciAoUmVwb3J0TGFiIFBERiBMaWJyYXJ5IC0gXChvcGVuc291cmNlXCkpIAogIC9TdWJqZWN0ICh1bnNwZWNpZmllZCkgL1RpdGxlICh1bnRpdGxlZCkgL1RyYXBwZWQgL0ZhbHNlCj4+CmVuZG9iago4IDAgb2JqCjw8Ci9Db3VudCAxIC9LaWRzIFsgNSAwIFIgXSAvVHlwZSAvUGFnZXMKPj4KZW5kb2JqCjkgMCBvYmoKPDwKL0ZpbHRlciBbIC9BU0NJSTg1RGVjb2RlIC9GbGF0ZURlY29kZSBdIC9MZW5ndGggODc1Cj4+CnN0cmVhbQpHYXQ9KWdNWV8xJjpPIks5VmtjXi5QU0wjb28xbj4qIU1ULU0pVVBIal5tSSdfJUMhUEBvbFtGXj5nL2whMGEzRjdiMj4iUjVubydgWTheWEJfPEduISNHXEBRUDpoTVlscjJZJVVvY3JwZiplP1RRWUpHKT02NkBEKCRxOk5ldXAqUzZhP1dLQChDTXE9SUVVay1HVUcxWiguc25ILl8pTmZBV2xPVixKbzouQkx0N04hQDRhOWkqRU4tMjwiXjxCWS5NbVwwNCpwSUdzV0NzY3NGZTElbUw1MyspNjlWQDRpPmYjRSRfWkNqOjk8aUYkOUxtSC9BY3RKXk9kVjRAV0tZOD5SdF1VK2JdOixAREdGNUxbZF9oZ3BSWjBuKklTKXE7VWcjMyZIOmglLm9AZGdwN0QqKS8qNy0mM1tfcV08NFpXRT8zaUIlLUY5Il0wX0hmWShmM2MhVD0sTVIsJXIqIydJXylsVSQ1O1Y1MCtfVylYPFMzUmxoaUVUbl1ib1pBUjgxNm1FRGlDPzlcTCNvaVtLcUNRcHBsRW9icGVvOV9NPHReYEBOa2piNXEhZiI0KnRcUFs9NTBoNyN1JmUyQl9kc1AwSTBRNlFDUjdsQVU3UD84bDRtJjgiOTJRSGNHPTIyKEdoYShrTWlYKTQqP1JsakdnN29ASmUwWGNybyRVWkYuQkkzQ2ZGSnVLUEVNVSNTbFhkKChxJktEY2VAI1U9YmRQbEgyKFtNZUJNP1RZSnJQZCchYWUhOmpBJ1E/UWtqdEsxdXAsaWtxWCtwTU1sI3FmZWxgJWdgPjI0I0MuZkYzQmprNmprSilQO19GRlEjK01FakM+NyhgPmNwbGdEOEo6Q3ArYThMOEQqOGA+VTpmUkshMCtXRFcyT0ZzLTpvSDdSbDFqP3A6ZFczSCsoczBxPk0/YHQqNl9dI1ttc0FtcE0rKGVtZyZmZ14iJCpJXWlzPk1mVixsQWRFK1g6ZzQrQDNbU2AhZ2EqclgiOS5lbzAvaVNERnMlMEcvSylCW0hCXiRwLzpnVU01cm04citgQExHamFIcGouOmZjL0U8XCE6WVouT1JWXGRbRUlhajYhYVIoNCQ0IUk+JFVTOFc/R0lvNG5uI0NtO3FQWEZNaShpZS5EYHNsa3E8TSxcVl5+PmVuZHN0cmVhbQplbmRvYmoKeHJlZgowIDEwCjAwMDAwMDAwMDAgNjU1MzUgZiAKMDAwMDAwMDA2MSAwMDAwMCBuIAowMDAwMDAwMTEyIDAwMDAwIG4gCjAwMDAwMDAyMTkgMDAwMDAgbiAKMDAwMDAwMDMzMSAwMDAwMCBuIAowMDAwMDAwNDQ2IDAwMDAwIG4gCjAwMDAwMDA2MzkgMDAwMDAgbiAKMDAwMDAwMDcwNyAwMDAwMCBuIAowMDAwMDAwOTY4IDAwMDAwIG4gCjAwMDAwMDEwMjcgMDAwMDAgbiAKdHJhaWxlcgo8PAovSUQgCls8MTJhNWFjZTFhZjMxMzkxYTVjNzdhM2Q2ZGQ4MWZjYTg+PDEyYTVhY2UxYWYzMTM5MWE1Yzc3YTNkNmRkODFmY2E4Pl0KJSBSZXBvcnRMYWIgZ2VuZXJhdGVkIFBERiBkb2N1bWVudCAtLSBkaWdlc3QgKG9wZW5zb3VyY2UpCgovSW5mbyA3IDAgUgovUm9vdCA2IDAgUgovU2l6ZSAxMAo+PgpzdGFydHhyZWYKMTk5MgolJUVPRgo=","r1":{"candidates":[{"content":{"parts":[{"text":"{\"doc_type\":\"invoice\",\"language\":\"fr\",\"fields\":[{\"name\":\"supplier_name\",\"value\":\"BOREAL SOLUTIONS INC.\",\"source_quote\":\"BOREAL SOLUTIONS INC.\",\"page\":1,\"found\":true},{\"name\":\"supplier_province\",\"value\":\"Montreal (Quebec) H3B 1K9\",\"source_quote\":\"Montreal (Quebec) H3B 1K9\",\"page\":1,\"found\":true},{\"name\":\"bill_to_province\",\"value\":\"Montreal (Quebec) H3A 0A1\",\"source_quote\":\"Montreal (Quebec) H3A 0A1\",\"page\":1,\"found\":true},{\"name\":\"gst_hst_number\",\"value\":\"123456789 RT0001\",\"source_quote\":\"No TPS/TVH : 123456789 RT0001\",\"page\":1,\"found\":true},{\"name\":\"qst_number\",\"value\":\"\",\"source_quote\":\"\",\"page\":1,\"found\":false},{\"name\":\"invoice_number\",\"value\":\"INV-88912\",\"source_quote\":\"No: INV-88912\",\"page\":1,\"found\":true},{\"name\":\"invoice_date_raw\",\"value\":\"03/04/2026\",\"source_quote\":\"Date: 03/04/2026\",\"page\":1,\"found\":true},{\"name\":\"subtotal\",\"value\":\"4 240,00 $\",\"source_quote\":\"4 240,00 $\",\"page\":1,\"found\":true},{\"name\":\"gst_amount\",\"value\":\"212,00 $\",\"source_quote\":\"212,00 $\",\"page\":1,\"found\":true},{\"name\":\"qst_amount\",\"value\":\"422,94 $\",\"source_quote\":\"422,94 $\",\"page\":1,\"found\":true},{\"name\":\"total\",\"value\":\"4 874,94 $\",\"source_quote\":\"4 874,94 $\",\"page\":1,\"found\":true}]}"}]}}]},"r2":{"candidates":[{"content":{"parts":[{"text":"{\"doc_type\":\"invoice\",\"language\":\"fr\",\"fields\":[{\"name\":\"supplier_name\",\"value\":\"BOREAL SOLUTIONS INC.\",\"source_quote\":\"BOREAL SOLUTIONS INC.\",\"page\":1,\"found\":true},{\"name\":\"supplier_province\",\"value\":\"QC\",\"source_quote\":\"Montreal (Quebec) H3B 1K9\",\"page\":1,\"found\":true},{\"name\":\"bill_to_province\",\"value\":\"QC\",\"source_quote\":\"Montreal (Quebec) H3A 0A1\",\"page\":1,\"found\":true},{\"name\":\"gst_hst_number\",\"value\":\"123456789 RT0001\",\"source_quote\":\"No TPS/TVH : 123456789 RT0001\",\"page\":1,\"found\":true},{\"name\":\"qst_number\",\"value\":\"\",\"source_quote\":\"\",\"page\":1,\"found\":false},{\"name\":\"invoice_number\",\"value\":\"INV-88912\",\"source_quote\":\"No: INV-88912\",\"page\":1,\"found\":true},{\"name\":\"invoice_date_raw\",\"value\":\"03/04/2026\",\"source_quote\":\"Date: 03/04/2026\",\"page\":1,\"found\":true},{\"name\":\"subtotal\",\"value\":\"4 240,00 $\",\"source_quote\":\"4 240,00 $\",\"page\":1,\"found\":true},{\"name\":\"gst_amount\",\"value\":\"212,00 $\",\"source_quote\":\"212,00 $\",\"page\":1,\"found\":true},{\"name\":\"qst_amount\",\"value\":\"422,94 $\",\"source_quote\":\"422,94 $\",\"page\":1,\"found\":true},{\"name\":\"total\",\"value\":\"4 874,94 $\",\"source_quote\":\"4 874,94 $\",\"page\":1,\"found\":true}]}"}]}}]}},"02_INV-MR-1001_MapleRidge_ON.pdf":{"pdf":"JVBERi0xLjMKJZOMi54gUmVwb3J0TGFiIEdlbmVyYXRlZCBQREYgZG9jdW1lbnQgKG9wZW5zb3VyY2UpCjEgMCBvYmoKPDwKL0YxIDIgMCBSIC9GMiAzIDAgUiAvRjMgNCAwIFIKPj4KZW5kb2JqCjIgMCBvYmoKPDwKL0Jhc2VGb250IC9IZWx2ZXRpY2EgL0VuY29kaW5nIC9XaW5BbnNpRW5jb2RpbmcgL05hbWUgL0YxIC9TdWJ0eXBlIC9UeXBlMSAvVHlwZSAvRm9udAo+PgplbmRvYmoKMyAwIG9iago8PAovQmFzZUZvbnQgL0hlbHZldGljYS1Cb2xkIC9FbmNvZGluZyAvV2luQW5zaUVuY29kaW5nIC9OYW1lIC9GMiAvU3VidHlwZSAvVHlwZTEgL1R5cGUgL0ZvbnQKPj4KZW5kb2JqCjQgMCBvYmoKPDwKL0Jhc2VGb250IC9IZWx2ZXRpY2EtT2JsaXF1ZSAvRW5jb2RpbmcgL1dpbkFuc2lFbmNvZGluZyAvTmFtZSAvRjMgL1N1YnR5cGUgL1R5cGUxIC9UeXBlIC9Gb250Cj4+CmVuZG9iago1IDAgb2JqCjw8Ci9Db250ZW50cyA5IDAgUiAvTWVkaWFCb3ggWyAwIDAgNjEyIDc5MiBdIC9QYXJlbnQgOCAwIFIgL1Jlc291cmNlcyA8PAovRm9udCAxIDAgUiAvUHJvY1NldCBbIC9QREYgL1RleHQgL0ltYWdlQiAvSW1hZ2VDIC9JbWFnZUkgXQo+PiAvUm90YXRlIDAgL1RyYW5zIDw8Cgo+PiAKICAvVHlwZSAvUGFnZQo+PgplbmRvYmoKNiAwIG9iago8PAovUGFnZU1vZGUgL1VzZU5vbmUgL1BhZ2VzIDggMCBSIC9UeXBlIC9DYXRhbG9nCj4+CmVuZG9iago3IDAgb2JqCjw8Ci9BdXRob3IgKGFub255bW91cykgL0NyZWF0aW9uRGF0ZSAoRDoyMDI2MTAwOTEzNTkwNSswMCcwMCcpIC9DcmVhdG9yIChhbm9ueW1vdXMpIC9LZXl3b3JkcyAoKSAvTW9kRGF0ZSAoRDoyMDI2MTAwOTEzNTkwNSswMCcwMCcpIC9Qcm9kdWNlciAoUmVwb3J0TGFiIFBERiBMaWJyYXJ5IC0gXChvcGVuc291cmNlXCkpIAogIC9TdWJqZWN0ICh1bnNwZWNpZmllZCkgL1RpdGxlICh1bnRpdGxlZCkgL1RyYXBwZWQgL0ZhbHNlCj4+CmVuZG9iago4IDAgb2JqCjw8Ci9Db3VudCAxIC9LaWRzIFsgNSAwIFIgXSAvVHlwZSAvUGFnZXMKPj4KZW5kb2JqCjkgMCBvYmoKPDwKL0ZpbHRlciBbIC9BU0NJSTg1RGVjb2RlIC9GbGF0ZURlY29kZSBdIC9MZW5ndGggODQ0Cj4+CnN0cmVhbQpHYXQlIT51MDMvJ1JmLkc+XFFsYFdBVixKMyhgIiIjcFdCYDcoYyleXVU3OTdZZipcQlFdOnQ/Mz9OP3MyQkFfbidqOjokSFtMNEQ2TkdqX1dXJE5qXmNAMVY5KjBiSl5CYGFCKFxlT2NJVDNGSitLU2BXJmNLMTYpQEAiLW4oQDpROi5BXVw4W3FPWSRPSlBDNmwmU185V2hjOmszKk5TLE9kPyo7P0M6R00sQ0xMUElNQCptbUE7aVAuMUg6ZVFUXUxmYHBBKDcoUVJUOCQhTiQiLVlHSl1sVXU7ZFlfTlhZJklfXUlXZ3VxKGknN19pJXJdJS4iUS9vMGReaFg7a1VYIjpZZj1EWHJlaltEKjNacTU6NW5DZz4rcmwocyFhZz8vSiMwMjUmTThYIV9haUtNT2BKPyRGRE5STFJDYWE5aDNWZklQVFoodGw2OS5JNXV0OT11JFooYS5yQSRZbidvKEFYczhAcWlgcEQkWWwkIWZSOXRAUU5iaUZPRzs7NkxoM19tPF5EcUpDSTw+ZGp0VHJIUVROOF9TKjBTMFtMMm1yWG07ZzVVXD8nRS1vR0hIXy9XUGE4RyluWm8laGk6Y2k5a0wkM2BPW0RXYldSTFVWL2U0PTZgTzY+K0RqZ3JnXWtVTE5ybWkwVm5ZXz5xUy46blRuYShZLjM2MVFYTF1aLUhMXFhGOHRkXEwnU0xuUUdxY0RKPUpsYThKaVsqZkNqayNkSW9TPGwlRUMxYyslK2RZW1xHSSIwYWUwOUpVQUZvUTRGJWdQbk5YcyMlWFZpYTwwcictTlF1UFpoajRSbk41LHIuQUI9JjkoQDIyTiw/NTtwRWtMOl9ZPzQ0NGlgOy8yVywzI0IicUlAcm5wLDUkVGZOI2lPZGMyInQrITA5RDtnRCdqSE4hO2EtKyJGTCghakZ0O2ZoW0FkM1hRVFdIaCNMUi46R0heYFM3KyQuIXEyRis2N19QazYsLiVEMlJOL0RkYUlscHUkNnIkcF5yITMxVV9RamddaWxyNjpmbWFHPSxCVF4sKWs9X0xIcWxwXUklVmY4UkQuUDVwUXA/JFJLciRFR14hOUxiYjxlRzlmbGphLUQlJnBhIUsvdCs7Wn4+ZW5kc3RyZWFtCmVuZG9iagp4cmVmCjAgMTAKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDYxIDAwMDAwIG4gCjAwMDAwMDAxMTIgMDAwMDAgbiAKMDAwMDAwMDIxOSAwMDAwMCBuIAowMDAwMDAwMzMxIDAwMDAwIG4gCjAwMDAwMDA0NDYgMDAwMDAgbiAKMDAwMDAwMDYzOSAwMDAwMCBuIAowMDAwMDAwNzA3IDAwMDAwIG4gCjAwMDAwMDA5NjggMDAwMDAgbiAKMDAwMDAwMTAyNyAwMDAwMCBuIAp0cmFpbGVyCjw8Ci9JRCAKWzxiOTE3OTY0OTJjMWRlMTFmMmFjMTJmMDM0OGNhYjU1NT48YjkxNzk2NDkyYzFkZTExZjJhYzEyZjAzNDhjYWI1NTU+XQolIFJlcG9ydExhYiBnZW5lcmF0ZWQgUERGIGRvY3VtZW50IC0tIGRpZ2VzdCAob3BlbnNvdXJjZSkKCi9JbmZvIDcgMCBSCi9Sb290IDYgMCBSCi9TaXplIDEwCj4+CnN0YXJ0eHJlZgoxOTYxCiUlRU9GCg==","r1":{"candidates":[{"content":{"parts":[{"text":"{\"doc_type\":\"invoice\",\"language\":\"en\",\"fields\":[{\"name\":\"supplier_name\",\"value\":\"Maple Ridge IT Services Ltd.\",\"source_quote\":\"Maple Ridge IT Services Ltd.\",\"page\":1,\"found\":true},{\"name\":\"supplier_province\",\"value\":\"ON\",\"source_quote\":\"ON\",\"page\":1,\"found\":true},{\"name\":\"bill_to_province\",\"value\":\"ON\",\"source_quote\":\"ON\",\"page\":1,\"found\":true},{\"name\":\"gst_hst_number\",\"value\":\"987654321 RT0001\",\"source_quote\":\"987654321 RT0001\",\"page\":1,\"found\":true},{\"name\":\"invoice_number\",\"value\":\"MR-1001\",\"source_quote\":\"MR-1001\",\"page\":1,\"found\":true},{\"name\":\"invoice_date_raw\",\"value\":\"2026-09-15\",\"source_quote\":\"2026-09-15\",\"page\":1,\"found\":true},{\"name\":\"subtotal\",\"value\":\"$10,000.00\",\"source_quote\":\"$10,000.00\",\"page\":1,\"found\":true},{\"name\":\"hst_amount\",\"value\":\"$1,300.00\",\"source_quote\":\"$1,300.00\",\"page\":1,\"found\":true},{\"name\":\"total\",\"value\":\"$11,300.00\",\"source_quote\":\"$11,300.00\",\"page\":1,\"found\":true}]}"}]}}]},"r2":{"candidates":[{"content":{"parts":[{"text":"{\"doc_type\":\"invoice\",\"language\":\"en\",\"fields\":[{\"name\":\"supplier_name\",\"value\":\"Maple Ridge IT Services Ltd.\",\"source_quote\":\"Maple Ridge IT Services Ltd.\",\"page\":1,\"found\":true},{\"name\":\"supplier_province\",\"value\":\"ON\",\"source_quote\":\"ON\",\"page\":1,\"found\":true},{\"name\":\"bill_to_province\",\"value\":\"ON\",\"source_quote\":\"ON\",\"page\":1,\"found\":true},{\"name\":\"gst_hst_number\",\"value\":\"987654321 RT0001\",\"source_quote\":\"987654321 RT0001\",\"page\":1,\"found\":true},{\"name\":\"invoice_number\",\"value\":\"MR-1001\",\"source_quote\":\"MR-1001\",\"page\":1,\"found\":true},{\"name\":\"invoice_date_raw\",\"value\":\"2026-09-15\",\"source_quote\":\"2026-09-15\",\"page\":1,\"found\":true},{\"name\":\"subtotal\",\"value\":\"$10,000.00\",\"source_quote\":\"$10,000.00\",\"page\":1,\"found\":true},{\"name\":\"hst_amount\",\"value\":\"$1,300.00\",\"source_quote\":\"$1,300.00\",\"page\":1,\"found\":true},{\"name\":\"total\",\"value\":\"$11,300.00\",\"source_quote\":\"$11,300.00\",\"page\":1,\"found\":true}]}"}]}}]}},"03_INV-MR-1001_DUPLICATE.pdf":{"pdf":"JVBERi0xLjMKJZOMi54gUmVwb3J0TGFiIEdlbmVyYXRlZCBQREYgZG9jdW1lbnQgKG9wZW5zb3VyY2UpCjEgMCBvYmoKPDwKL0YxIDIgMCBSIC9GMiAzIDAgUiAvRjMgNCAwIFIKPj4KZW5kb2JqCjIgMCBvYmoKPDwKL0Jhc2VGb250IC9IZWx2ZXRpY2EgL0VuY29kaW5nIC9XaW5BbnNpRW5jb2RpbmcgL05hbWUgL0YxIC9TdWJ0eXBlIC9UeXBlMSAvVHlwZSAvRm9udAo+PgplbmRvYmoKMyAwIG9iago8PAovQmFzZUZvbnQgL0hlbHZldGljYS1Cb2xkIC9FbmNvZGluZyAvV2luQW5zaUVuY29kaW5nIC9OYW1lIC9GMiAvU3VidHlwZSAvVHlwZTEgL1R5cGUgL0ZvbnQKPj4KZW5kb2JqCjQgMCBvYmoKPDwKL0Jhc2VGb250IC9IZWx2ZXRpY2EtT2JsaXF1ZSAvRW5jb2RpbmcgL1dpbkFuc2lFbmNvZGluZyAvTmFtZSAvRjMgL1N1YnR5cGUgL1R5cGUxIC9UeXBlIC9Gb250Cj4+CmVuZG9iago1IDAgb2JqCjw8Ci9Db250ZW50cyA5IDAgUiAvTWVkaWFCb3ggWyAwIDAgNjEyIDc5MiBdIC9QYXJlbnQgOCAwIFIgL1Jlc291cmNlcyA8PAovRm9udCAxIDAgUiAvUHJvY1NldCBbIC9QREYgL1RleHQgL0ltYWdlQiAvSW1hZ2VDIC9JbWFnZUkgXQo+PiAvUm90YXRlIDAgL1RyYW5zIDw8Cgo+PiAKICAvVHlwZSAvUGFnZQo+PgplbmRvYmoKNiAwIG9iago8PAovUGFnZU1vZGUgL1VzZU5vbmUgL1BhZ2VzIDggMCBSIC9UeXBlIC9DYXRhbG9nCj4+CmVuZG9iago3IDAgb2JqCjw8Ci9BdXRob3IgKGFub255bW91cykgL0NyZWF0aW9uRGF0ZSAoRDoyMDI2MTAwOTEzNTkwNSswMCcwMCcpIC9DcmVhdG9yIChhbm9ueW1vdXMpIC9LZXl3b3JkcyAoKSAvTW9kRGF0ZSAoRDoyMDI2MTAwOTEzNTkwNSswMCcwMCcpIC9Qcm9kdWNlciAoUmVwb3J0TGFiIFBERiBMaWJyYXJ5IC0gXChvcGVuc291cmNlXCkpIAogIC9TdWJqZWN0ICh1bnNwZWNpZmllZCkgL1RpdGxlICh1bnRpdGxlZCkgL1RyYXBwZWQgL0ZhbHNlCj4+CmVuZG9iago4IDAgb2JqCjw8Ci9Db3VudCAxIC9LaWRzIFsgNSAwIFIgXSAvVHlwZSAvUGFnZXMKPj4KZW5kb2JqCjkgMCBvYmoKPDwKL0ZpbHRlciBbIC9BU0NJSTg1RGVjb2RlIC9GbGF0ZURlY29kZSBdIC9MZW5ndGggODQ0Cj4+CnN0cmVhbQpHYXQlIT51MDMvJ1JmLkc+XFFsYFdBVixKMyhgIiIjcFdCYDcoYyleXVU3OTdZZipcQlFdOnQ/Mz9OP3MyQkFfbidqOjokSFtMNEQ2TkdqX1dXJE5qXmNAMVY5KjBiSl5CYGFCKFxlT2NJVDNGSitLU2BXJmNLMTYpQEAiLW4oQDpROi5BXVw4W3FPWSRPSlBDNmwmU185V2hjOmszKk5TLE9kPyo7P0M6R00sQ0xMUElNQCptbUE7aVAuMUg6ZVFUXUxmYHBBKDcoUVJUOCQhTiQiLVlHSl1sVXU7ZFlfTlhZJklfXUlXZ3VxKGknN19pJXJdJS4iUS9vMGReaFg7a1VYIjpZZj1EWHJlaltEKjNacTU6NW5DZz4rcmwocyFhZz8vSiMwMjUmTThYIV9haUtNT2BKPyRGRE5STFJDYWE5aDNWZklQVFoodGw2OS5JNXV0OT11JFooYS5yQSRZbidvKEFYczhAcWlgcEQkWWwkIWZSOXRAUU5iaUZPRzs7NkxoM19tPF5EcUpDSTw+ZGp0VHJIUVROOF9TKjBTMFtMMm1yWG07ZzVVXD8nRS1vR0hIXy9XUGE4RyluWm8laGk6Y2k5a0wkM2BPW0RXYldSTFVWL2U0PTZgTzY+K0RqZ3JnXWtVTE5ybWkwVm5ZXz5xUy46blRuYShZLjM2MVFYTF1aLUhMXFhGOHRkXEwnU0xuUUdxY0RKPUpsYThKaVsqZkNqayNkSW9TPGwlRUMxYyslK2RZW1xHSSIwYWUwOUpVQUZvUTRGJWdQbk5YcyMlWFZpYTwwcictTlF1UFpoajRSbk41LHIuQUI9JjkoQDIyTiw/NTtwRWtMOl9ZPzQ0NGlgOy8yVywzI0IicUlAcm5wLDUkVGZOI2lPZGMyInQrITA5RDtnRCdqSE4hO2EtKyJGTCghakZ0O2ZoW0FkM1hRVFdIaCNMUi46R0heYFM3KyQuIXEyRis2N19QazYsLiVEMlJOL0RkYUlscHUkNnIkcF5yITMxVV9RamddaWxyNjpmbWFHPSxCVF4sKWs9X0xIcWxwXUklVmY4UkQuUDVwUXA/JFJLciRFR14hOUxiYjxlRzlmbGphLUQlJnBhIUsvdCs7Wn4+ZW5kc3RyZWFtCmVuZG9iagp4cmVmCjAgMTAKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDYxIDAwMDAwIG4gCjAwMDAwMDAxMTIgMDAwMDAgbiAKMDAwMDAwMDIxOSAwMDAwMCBuIAowMDAwMDAwMzMxIDAwMDAwIG4gCjAwMDAwMDA0NDYgMDAwMDAgbiAKMDAwMDAwMDYzOSAwMDAwMCBuIAowMDAwMDAwNzA3IDAwMDAwIG4gCjAwMDAwMDA5NjggMDAwMDAgbiAKMDAwMDAwMTAyNyAwMDAwMCBuIAp0cmFpbGVyCjw8Ci9JRCAKWzxiOTE3OTY0OTJjMWRlMTFmMmFjMTJmMDM0OGNhYjU1NT48YjkxNzk2NDkyYzFkZTExZjJhYzEyZjAzNDhjYWI1NTU+XQolIFJlcG9ydExhYiBnZW5lcmF0ZWQgUERGIGRvY3VtZW50IC0tIGRpZ2VzdCAob3BlbnNvdXJjZSkKCi9JbmZvIDcgMCBSCi9Sb290IDYgMCBSCi9TaXplIDEwCj4+CnN0YXJ0eHJlZgoxOTYxCiUlRU9GCg==","r1":{"candidates":[{"content":{"parts":[{"text":"{\"doc_type\":\"invoice\",\"language\":\"en\",\"fields\":[{\"name\":\"supplier_name\",\"value\":\"Maple Ridge IT Services Ltd.\",\"source_quote\":\"Maple Ridge IT Services Ltd.\",\"page\":1,\"found\":true},{\"name\":\"supplier_province\",\"value\":\"ON\",\"source_quote\":\"ON\",\"page\":1,\"found\":true},{\"name\":\"bill_to_province\",\"value\":\"ON\",\"source_quote\":\"ON\",\"page\":1,\"found\":true},{\"name\":\"gst_hst_number\",\"value\":\"987654321 RT0001\",\"source_quote\":\"987654321 RT0001\",\"page\":1,\"found\":true},{\"name\":\"invoice_number\",\"value\":\"MR-1001\",\"source_quote\":\"MR-1001\",\"page\":1,\"found\":true},{\"name\":\"invoice_date_raw\",\"value\":\"2026-09-15\",\"source_quote\":\"2026-09-15\",\"page\":1,\"found\":true},{\"name\":\"subtotal\",\"value\":\"$10,000.00\",\"source_quote\":\"$10,000.00\",\"page\":1,\"found\":true},{\"name\":\"hst_amount\",\"value\":\"$1,300.00\",\"source_quote\":\"$1,300.00\",\"page\":1,\"found\":true},{\"name\":\"total\",\"value\":\"$11,300.00\",\"source_quote\":\"$11,300.00\",\"page\":1,\"found\":true}]}"}]}}]},"r2":{"candidates":[{"content":{"parts":[{"text":"{\"doc_type\":\"invoice\",\"language\":\"en\",\"fields\":[{\"name\":\"supplier_name\",\"value\":\"Maple Ridge IT Services Ltd.\",\"source_quote\":\"Maple Ridge IT Services Ltd.\",\"page\":1,\"found\":true},{\"name\":\"supplier_province\",\"value\":\"ON\",\"source_quote\":\"ON\",\"page\":1,\"found\":true},{\"name\":\"bill_to_province\",\"value\":\"ON\",\"source_quote\":\"ON\",\"page\":1,\"found\":true},{\"name\":\"gst_hst_number\",\"value\":\"987654321 RT0001\",\"source_quote\":\"987654321 RT0001\",\"page\":1,\"found\":true},{\"name\":\"invoice_number\",\"value\":\"MR-1001\",\"source_quote\":\"MR-1001\",\"page\":1,\"found\":true},{\"name\":\"invoice_date_raw\",\"value\":\"2026-09-15\",\"source_quote\":\"2026-09-15\",\"page\":1,\"found\":true},{\"name\":\"subtotal\",\"value\":\"$10,000.00\",\"source_quote\":\"$10,000.00\",\"page\":1,\"found\":true},{\"name\":\"hst_amount\",\"value\":\"$1,300.00\",\"source_quote\":\"$1,300.00\",\"page\":1,\"found\":true},{\"name\":\"total\",\"value\":\"$11,300.00\",\"source_quote\":\"$11,300.00\",\"page\":1,\"found\":true}]}"}]}}]}},"04_INV-PC-55_PacificCloud_BC.pdf":{"pdf":"JVBERi0xLjMKJZOMi54gUmVwb3J0TGFiIEdlbmVyYXRlZCBQREYgZG9jdW1lbnQgKG9wZW5zb3VyY2UpCjEgMCBvYmoKPDwKL0YxIDIgMCBSIC9GMiAzIDAgUiAvRjMgNCAwIFIKPj4KZW5kb2JqCjIgMCBvYmoKPDwKL0Jhc2VGb250IC9IZWx2ZXRpY2EgL0VuY29kaW5nIC9XaW5BbnNpRW5jb2RpbmcgL05hbWUgL0YxIC9TdWJ0eXBlIC9UeXBlMSAvVHlwZSAvRm9udAo+PgplbmRvYmoKMyAwIG9iago8PAovQmFzZUZvbnQgL0hlbHZldGljYS1Cb2xkIC9FbmNvZGluZyAvV2luQW5zaUVuY29kaW5nIC9OYW1lIC9GMiAvU3VidHlwZSAvVHlwZTEgL1R5cGUgL0ZvbnQKPj4KZW5kb2JqCjQgMCBvYmoKPDwKL0Jhc2VGb250IC9IZWx2ZXRpY2EtT2JsaXF1ZSAvRW5jb2RpbmcgL1dpbkFuc2lFbmNvZGluZyAvTmFtZSAvRjMgL1N1YnR5cGUgL1R5cGUxIC9UeXBlIC9Gb250Cj4+CmVuZG9iago1IDAgb2JqCjw8Ci9Db250ZW50cyA5IDAgUiAvTWVkaWFCb3ggWyAwIDAgNjEyIDc5MiBdIC9QYXJlbnQgOCAwIFIgL1Jlc291cmNlcyA8PAovRm9udCAxIDAgUiAvUHJvY1NldCBbIC9QREYgL1RleHQgL0ltYWdlQiAvSW1hZ2VDIC9JbWFnZUkgXQo+PiAvUm90YXRlIDAgL1RyYW5zIDw8Cgo+PiAKICAvVHlwZSAvUGFnZQo+PgplbmRvYmoKNiAwIG9iago8PAovUGFnZU1vZGUgL1VzZU5vbmUgL1BhZ2VzIDggMCBSIC9UeXBlIC9DYXRhbG9nCj4+CmVuZG9iago3IDAgb2JqCjw8Ci9BdXRob3IgKGFub255bW91cykgL0NyZWF0aW9uRGF0ZSAoRDoyMDI2MTAwOTEzNTkwNSswMCcwMCcpIC9DcmVhdG9yIChhbm9ueW1vdXMpIC9LZXl3b3JkcyAoKSAvTW9kRGF0ZSAoRDoyMDI2MTAwOTEzNTkwNSswMCcwMCcpIC9Qcm9kdWNlciAoUmVwb3J0TGFiIFBERiBMaWJyYXJ5IC0gXChvcGVuc291cmNlXCkpIAogIC9TdWJqZWN0ICh1bnNwZWNpZmllZCkgL1RpdGxlICh1bnRpdGxlZCkgL1RyYXBwZWQgL0ZhbHNlCj4+CmVuZG9iago4IDAgb2JqCjw8Ci9Db3VudCAxIC9LaWRzIFsgNSAwIFIgXSAvVHlwZSAvUGFnZXMKPj4KZW5kb2JqCjkgMCBvYmoKPDwKL0ZpbHRlciBbIC9BU0NJSTg1RGVjb2RlIC9GbGF0ZURlY29kZSBdIC9MZW5ndGggODAyCj4+CnN0cmVhbQpHYXQkdT51MDMvJ1JmLkcqLC8pdVdBVi1VZEExXDtQZ0tma0NBIVtNR1I6QCNZZipcQlFdOnQ/Mz9OPy5SZ3AsXVpFL0UhNG5uYSxiPFlJOFdkZzA2IitkNEcjMCVnKF8tR3RkUzc8dUBXZD42PD04KmxzczZhImxpREs0ZUhfOT4rKUNPY2RSTlRjRkM2IT9rLVxpNkQmNz0hYiR0NGlYOFsnNGxcSjgiNS44RkVWMGYrTkpqdShCK0dabjFfTiljVFJPMFt0VyZFMiVaSi90dUkvM2ZxMWYlNjxMM2gkRzcyJCUzR0Y3KSF0XidkT15IY3FxM2R1bGI5Mmk1L1tPUyZJWSUmPEBTQS8jSjNIWTQmcGdFTkAyIkc/dWZyTDJBMDRtRmtkcHNkPkBsP189XDowYGhsLWE7RyVZRUolUU9hWUU9cWN0K2AzR2g9dCI2K1tzSzo5LS43REErdS8uRVQxZm0+Z1A7R0w4JiUrNlxaZEpdK19EVVo5UVc2dW89VnBbZjcxNUtCU2NYVTMlTG5UNmZpRTImV2ViKkE6RipeLCghNC9PP3JmNlM9LTYoaWEwTyhBQ1U+Ni9fWTtWb3RLaVVaZTBIJm9mcVpdNG8/S0ElN1BsJlBccTdKYiJSKFotNFk3XXFjL3NASmJRckwrJTE+RjIyPWlWV0lIRFNnalYwJ1U5XEs4UDVdZWxfIlpRZEpFT25qdGYuVGEhQUIwRzhFMjhYZ2hZdTxuOUlCLnRjNUhAVlBlZ2cjMWsqM0FuckM0LUROUjkpdUcqP1RrW3Vrb0IyLm8pMWVqXEhZPHFDOWs9UyJZMW4lMmYpbTxbYGs+LWtUUzZsX2lmRFFKXSVOR1U/QV5cdTU1RClVY1swKCNJaTRDTklhbjEtQmpXSWNSU1FwQkhJbDZpMXFDMUkzJyNZT2xScF5PZj9vUVA0RzFnOCwrYG86ZV83TTJYRDRJSlQlMCdqalgkYlBAaihXUkMrU00rSDthc0NMU0xLXXJZPk09bF5BSmd0M1otXDM4ZVFKb1cuLmktYz9KOmgkX1YiX25bNSpMT34+ZW5kc3RyZWFtCmVuZG9iagp4cmVmCjAgMTAKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDYxIDAwMDAwIG4gCjAwMDAwMDAxMTIgMDAwMDAgbiAKMDAwMDAwMDIxOSAwMDAwMCBuIAowMDAwMDAwMzMxIDAwMDAwIG4gCjAwMDAwMDA0NDYgMDAwMDAgbiAKMDAwMDAwMDYzOSAwMDAwMCBuIAowMDAwMDAwNzA3IDAwMDAwIG4gCjAwMDAwMDA5NjggMDAwMDAgbiAKMDAwMDAwMTAyNyAwMDAwMCBuIAp0cmFpbGVyCjw8Ci9JRCAKWzw1N2UxNDc3OTk3MDE2YjA4NjI0NWM1NWYwODkxYTdkMT48NTdlMTQ3Nzk5NzAxNmIwODYyNDVjNTVmMDg5MWE3ZDE+XQolIFJlcG9ydExhYiBnZW5lcmF0ZWQgUERGIGRvY3VtZW50IC0tIGRpZ2VzdCAob3BlbnNvdXJjZSkKCi9JbmZvIDcgMCBSCi9Sb290IDYgMCBSCi9TaXplIDEwCj4+CnN0YXJ0eHJlZgoxOTE5CiUlRU9GCg==","r1":{"candidates":[{"content":{"parts":[{"text":"{\"doc_type\":\"invoice\",\"language\":\"en\",\"fields\":[{\"name\":\"supplier_name\",\"value\":\"Pacific Cloud Ltd.\",\"source_quote\":\"Pacific Cloud Ltd.\",\"page\":1,\"found\":true},{\"name\":\"supplier_province\",\"value\":\"BC\",\"source_quote\":\"BC\",\"page\":1,\"found\":true},{\"name\":\"bill_to_province\",\"value\":\"ON\",\"source_quote\":\"ON\",\"page\":1,\"found\":true},{\"name\":\"gst_hst_number\",\"value\":\"111222333 RT0001\",\"source_quote\":\"111222333 RT0001\",\"page\":1,\"found\":true},{\"name\":\"invoice_date_raw\",\"value\":\"2026-09-20\",\"source_quote\":\"2026-09-20\",\"page\":1,\"found\":true},{\"name\":\"invoice_number\",\"value\":\"PC-55\",\"source_quote\":\"PC-55\",\"page\":1,\"found\":true},{\"name\":\"subtotal\",\"value\":\"$8,000.00\",\"source_quote\":\"$8,000.00\",\"page\":1,\"found\":true},{\"name\":\"gst_amount\",\"value\":\"$400.00\",\"source_quote\":\"$400.00\",\"page\":1,\"found\":true},{\"name\":\"total\",\"value\":\"$8,400.00\",\"source_quote\":\"$8,400.00\",\"page\":1,\"found\":true}]}"}]}}]},"r2":{"candidates":[{"content":{"parts":[{"text":"{\"doc_type\":\"invoice\",\"language\":\"en\",\"fields\":[{\"name\":\"supplier_name\",\"value\":\"Pacific Cloud Ltd.\",\"source_quote\":\"Pacific Cloud Ltd.\",\"page\":1,\"found\":true},{\"name\":\"supplier_province\",\"value\":\"BC\",\"source_quote\":\"BC\",\"page\":1,\"found\":true},{\"name\":\"bill_to_province\",\"value\":\"ON\",\"source_quote\":\"ON\",\"page\":1,\"found\":true},{\"name\":\"gst_hst_number\",\"value\":\"111222333 RT0001\",\"source_quote\":\"111222333 RT0001\",\"page\":1,\"found\":true},{\"name\":\"invoice_date_raw\",\"value\":\"2026-09-20\",\"source_quote\":\"2026-09-20\",\"page\":1,\"found\":true},{\"name\":\"invoice_number\",\"value\":\"PC-55\",\"source_quote\":\"PC-55\",\"page\":1,\"found\":true},{\"name\":\"subtotal\",\"value\":\"$8,000.00\",\"source_quote\":\"$8,000.00\",\"page\":1,\"found\":true},{\"name\":\"gst_amount\",\"value\":\"$400.00\",\"source_quote\":\"$400.00\",\"page\":1,\"found\":true},{\"name\":\"total\",\"value\":\"$8,400.00\",\"source_quote\":\"$8,400.00\",\"page\":1,\"found\":true}]}"}]}}]}},"05_INV-PD-7_PrairieData_AB.pdf":{"pdf":"JVBERi0xLjMKJZOMi54gUmVwb3J0TGFiIEdlbmVyYXRlZCBQREYgZG9jdW1lbnQgKG9wZW5zb3VyY2UpCjEgMCBvYmoKPDwKL0YxIDIgMCBSIC9GMiAzIDAgUiAvRjMgNCAwIFIKPj4KZW5kb2JqCjIgMCBvYmoKPDwKL0Jhc2VGb250IC9IZWx2ZXRpY2EgL0VuY29kaW5nIC9XaW5BbnNpRW5jb2RpbmcgL05hbWUgL0YxIC9TdWJ0eXBlIC9UeXBlMSAvVHlwZSAvRm9udAo+PgplbmRvYmoKMyAwIG9iago8PAovQmFzZUZvbnQgL0hlbHZldGljYS1Cb2xkIC9FbmNvZGluZyAvV2luQW5zaUVuY29kaW5nIC9OYW1lIC9GMiAvU3VidHlwZSAvVHlwZTEgL1R5cGUgL0ZvbnQKPj4KZW5kb2JqCjQgMCBvYmoKPDwKL0Jhc2VGb250IC9IZWx2ZXRpY2EtT2JsaXF1ZSAvRW5jb2RpbmcgL1dpbkFuc2lFbmNvZGluZyAvTmFtZSAvRjMgL1N1YnR5cGUgL1R5cGUxIC9UeXBlIC9Gb250Cj4+CmVuZG9iago1IDAgb2JqCjw8Ci9Db250ZW50cyA5IDAgUiAvTWVkaWFCb3ggWyAwIDAgNjEyIDc5MiBdIC9QYXJlbnQgOCAwIFIgL1Jlc291cmNlcyA8PAovRm9udCAxIDAgUiAvUHJvY1NldCBbIC9QREYgL1RleHQgL0ltYWdlQiAvSW1hZ2VDIC9JbWFnZUkgXQo+PiAvUm90YXRlIDAgL1RyYW5zIDw8Cgo+PiAKICAvVHlwZSAvUGFnZQo+PgplbmRvYmoKNiAwIG9iago8PAovUGFnZU1vZGUgL1VzZU5vbmUgL1BhZ2VzIDggMCBSIC9UeXBlIC9DYXRhbG9nCj4+CmVuZG9iago3IDAgb2JqCjw8Ci9BdXRob3IgKGFub255bW91cykgL0NyZWF0aW9uRGF0ZSAoRDoyMDI2MTAwOTEzNTkwNSswMCcwMCcpIC9DcmVhdG9yIChhbm9ueW1vdXMpIC9LZXl3b3JkcyAoKSAvTW9kRGF0ZSAoRDoyMDI2MTAwOTEzNTkwNSswMCcwMCcpIC9Qcm9kdWNlciAoUmVwb3J0TGFiIFBERiBMaWJyYXJ5IC0gXChvcGVuc291cmNlXCkpIAogIC9TdWJqZWN0ICh1bnNwZWNpZmllZCkgL1RpdGxlICh1bnRpdGxlZCkgL1RyYXBwZWQgL0ZhbHNlCj4+CmVuZG9iago4IDAgb2JqCjw8Ci9Db3VudCAxIC9LaWRzIFsgNSAwIFIgXSAvVHlwZSAvUGFnZXMKPj4KZW5kb2JqCjkgMCBvYmoKPDwKL0ZpbHRlciBbIC9BU0NJSTg1RGVjb2RlIC9GbGF0ZURlY29kZSBdIC9MZW5ndGggNzgyCj4+CnN0cmVhbQpHYXQkdW1uX1tsJkgwbV1FUkwzVycvZDVZXDRPSCMyTjFENFhmL104TShiX2BgQFM5aDFoSCJQcURnZShKMGw5YjtJaXBTbiVGJ2xCKi1fNlYjOE9QSjI3NShrNiklb0U8aC4/IzMkNz5FRFlMaitNPj50JmNIb0xDJ1luS2Y1cFptKikvNWcxVGIlNUVzVnI8VjxBYzciLEtgVy1qIWg2S01nKlQ2cyw8LEAxNUspRWsmRHEhT0VrJEVMblE5TUwkRSpWOUNoRmNwJVV1VmEudExYWjhNXkFeOUosMzUoW2MoZ0AtJTEjTV5ja0FWXyRgb09PSCQ1PTwhLkdOQ3RcZnBBMFhVQ29vcFc3KFttP1VMPiJPYzNPJFUpRnJYMWYzKTE2NUpeJ24jNV1GUCxoOShXKFFPXVlHOSI/ZldiS1knTmhvalcsPWEtdUROYyIyb1dHNXBdWzQvNlZYUlhFKmgiRFgkUSokVENZMkVNaGI1RW5icTpoKElMb0s7c0tHQyVOS11FWXE9bChEOlZHNy0nZE1OUSJGbmhdMCtLZGdtbzFXI00vZ1tuUDRQNjJzZ0wpXUhLNylNXE9rVEQuMCtUcC5uRzUsW0trTD1yJVluUzpwVEMsTz1aUlZRXEJgKSkyZVt1S2koRyY/ZW8zbG8xLFhPb1JGUUoqYVBCc1dLQzNfYUlXW2tPIXVvJyYoLk9JZUU2Jl1WIWBAL1Msc2lqOlJOVC1nYldBUTtmRGxlQzRXMT5YW1klVzJwTDJFI0tjZDtFayJPMC5HL0lIOEUwLksjOWgtRlM/SS9fVERaOGtfWVFFZHFNP1VhcUJdO1o2JkksZF5IMVEoKDFQaDcyOStGPXVMPGNMOC9sXU5BQUBpYS8oR1lkKk1ia0xQOVlKLkU2cWRHO15TSHBwblowdFNLYk1iJmQyOnAvVm4xQUxSbm0yZ0ItOj0iaCFROC1VI1AiTU0iJEReZ1Q9WFVbLj5JZlA9LTg2PzVUcFc4TSlmI2dxQWZvUCNxPDI2VyRqVjdfZj84YTd+PmVuZHN0cmVhbQplbmRvYmoKeHJlZgowIDEwCjAwMDAwMDAwMDAgNjU1MzUgZiAKMDAwMDAwMDA2MSAwMDAwMCBuIAowMDAwMDAwMTEyIDAwMDAwIG4gCjAwMDAwMDAyMTkgMDAwMDAgbiAKMDAwMDAwMDMzMSAwMDAwMCBuIAowMDAwMDAwNDQ2IDAwMDAwIG4gCjAwMDAwMDA2MzkgMDAwMDAgbiAKMDAwMDAwMDcwNyAwMDAwMCBuIAowMDAwMDAwOTY4IDAwMDAwIG4gCjAwMDAwMDEwMjcgMDAwMDAgbiAKdHJhaWxlcgo8PAovSUQgCls8YTU4MmRjNDJiODMyOGRmMzIwM2ExNGRjMmE0NTQ4OGU+PGE1ODJkYzQyYjgzMjhkZjMyMDNhMTRkYzJhNDU0ODhlPl0KJSBSZXBvcnRMYWIgZ2VuZXJhdGVkIFBERiBkb2N1bWVudCAtLSBkaWdlc3QgKG9wZW5zb3VyY2UpCgovSW5mbyA3IDAgUgovUm9vdCA2IDAgUgovU2l6ZSAxMAo+PgpzdGFydHhyZWYKMTg5OQolJUVPRgo=","r1":{"candidates":[{"content":{"parts":[{"text":"{\"doc_type\":\"invoice\",\"language\":\"en\",\"fields\":[{\"name\":\"supplier_name\",\"value\":\"Prairie Data Corp.\",\"source_quote\":\"Prairie Data Corp.\",\"page\":1,\"found\":true},{\"name\":\"supplier_province\",\"value\":\"AB\",\"source_quote\":\"AB\",\"page\":1,\"found\":true},{\"name\":\"bill_to_province\",\"value\":\"AB\",\"source_quote\":\"AB\",\"page\":1,\"found\":true},{\"name\":\"gst_hst_number\",\"value\":\"444555666 RT0001\",\"source_quote\":\"444555666 RT0001\",\"page\":1,\"found\":true},{\"name\":\"invoice_number\",\"value\":\"PD-7\",\"source_quote\":\"PD-7\",\"page\":1,\"found\":true},{\"name\":\"invoice_date_raw\",\"value\":\"2026-09-22\",\"source_quote\":\"2026-09-22\",\"page\":1,\"found\":true},{\"name\":\"subtotal\",\"value\":\"$2,200.00\",\"source_quote\":\"$2,200.00\",\"page\":1,\"found\":true},{\"name\":\"gst_amount\",\"value\":\"$110.00\",\"source_quote\":\"$110.00\",\"page\":1,\"found\":true},{\"name\":\"total\",\"value\":\"$2,410.00\",\"source_quote\":\"$2,410.00\",\"page\":1,\"found\":true}]}"}]}}]},"r2":{"candidates":[{"content":{"parts":[{"text":"{\"doc_type\":\"invoice\",\"language\":\"en\",\"fields\":[{\"name\":\"supplier_name\",\"value\":\"Prairie Data Corp.\",\"source_quote\":\"Prairie Data Corp.\",\"page\":1,\"found\":true},{\"name\":\"supplier_province\",\"value\":\"AB\",\"source_quote\":\"AB\",\"page\":1,\"found\":true},{\"name\":\"bill_to_province\",\"value\":\"AB\",\"source_quote\":\"AB\",\"page\":1,\"found\":true},{\"name\":\"gst_hst_number\",\"value\":\"444555666 RT0001\",\"source_quote\":\"444555666 RT0001\",\"page\":1,\"found\":true},{\"name\":\"invoice_number\",\"value\":\"PD-7\",\"source_quote\":\"PD-7\",\"page\":1,\"found\":true},{\"name\":\"invoice_date_raw\",\"value\":\"2026-09-22\",\"source_quote\":\"2026-09-22\",\"page\":1,\"found\":true},{\"name\":\"subtotal\",\"value\":\"$2,200.00\",\"source_quote\":\"$2,200.00\",\"page\":1,\"found\":true},{\"name\":\"gst_amount\",\"value\":\"$110.00\",\"source_quote\":\"$110.00\",\"page\":1,\"found\":true},{\"name\":\"total\",\"value\":\"$2,410.00\",\"source_quote\":\"$2,410.00\",\"page\":1,\"found\":true}]}"}]}}]}},"06_INV-AP-310_AtlanticPrint_NS.pdf":{"pdf":"JVBERi0xLjMKJZOMi54gUmVwb3J0TGFiIEdlbmVyYXRlZCBQREYgZG9jdW1lbnQgKG9wZW5zb3VyY2UpCjEgMCBvYmoKPDwKL0YxIDIgMCBSIC9GMiAzIDAgUiAvRjMgNCAwIFIKPj4KZW5kb2JqCjIgMCBvYmoKPDwKL0Jhc2VGb250IC9IZWx2ZXRpY2EgL0VuY29kaW5nIC9XaW5BbnNpRW5jb2RpbmcgL05hbWUgL0YxIC9TdWJ0eXBlIC9UeXBlMSAvVHlwZSAvRm9udAo+PgplbmRvYmoKMyAwIG9iago8PAovQmFzZUZvbnQgL0hlbHZldGljYS1Cb2xkIC9FbmNvZGluZyAvV2luQW5zaUVuY29kaW5nIC9OYW1lIC9GMiAvU3VidHlwZSAvVHlwZTEgL1R5cGUgL0ZvbnQKPj4KZW5kb2JqCjQgMCBvYmoKPDwKL0Jhc2VGb250IC9IZWx2ZXRpY2EtT2JsaXF1ZSAvRW5jb2RpbmcgL1dpbkFuc2lFbmNvZGluZyAvTmFtZSAvRjMgL1N1YnR5cGUgL1R5cGUxIC9UeXBlIC9Gb250Cj4+CmVuZG9iago1IDAgb2JqCjw8Ci9Db250ZW50cyA5IDAgUiAvTWVkaWFCb3ggWyAwIDAgNjEyIDc5MiBdIC9QYXJlbnQgOCAwIFIgL1Jlc291cmNlcyA8PAovRm9udCAxIDAgUiAvUHJvY1NldCBbIC9QREYgL1RleHQgL0ltYWdlQiAvSW1hZ2VDIC9JbWFnZUkgXQo+PiAvUm90YXRlIDAgL1RyYW5zIDw8Cgo+PiAKICAvVHlwZSAvUGFnZQo+PgplbmRvYmoKNiAwIG9iago8PAovUGFnZU1vZGUgL1VzZU5vbmUgL1BhZ2VzIDggMCBSIC9UeXBlIC9DYXRhbG9nCj4+CmVuZG9iago3IDAgb2JqCjw8Ci9BdXRob3IgKGFub255bW91cykgL0NyZWF0aW9uRGF0ZSAoRDoyMDI2MTAwOTEzNTkwNSswMCcwMCcpIC9DcmVhdG9yIChhbm9ueW1vdXMpIC9LZXl3b3JkcyAoKSAvTW9kRGF0ZSAoRDoyMDI2MTAwOTEzNTkwNSswMCcwMCcpIC9Qcm9kdWNlciAoUmVwb3J0TGFiIFBERiBMaWJyYXJ5IC0gXChvcGVuc291cmNlXCkpIAogIC9TdWJqZWN0ICh1bnNwZWNpZmllZCkgL1RpdGxlICh1bnRpdGxlZCkgL1RyYXBwZWQgL0ZhbHNlCj4+CmVuZG9iago4IDAgb2JqCjw8Ci9Db3VudCAxIC9LaWRzIFsgNSAwIFIgXSAvVHlwZSAvUGFnZXMKPj4KZW5kb2JqCjkgMCBvYmoKPDwKL0ZpbHRlciBbIC9BU0NJSTg1RGVjb2RlIC9GbGF0ZURlY29kZSBdIC9MZW5ndGggNzg3Cj4+CnN0cmVhbQpHYXQkdUNKV1w9J2BIPVwzNz0vc2RxXDZmSDFiQWpBYVJFLls8ZT0ocHU4LyJRbUhwQFZAPDFhazwoL1IyQEw5S1pFRVVZcFJMOGpiczpbOldkZ04+YHJcYy8lKlg5KUo4ckZMYzdmZlY8U1JXSFgqQCUmYSNJaVc0R3BxXm5JLFo5LCpmYDkwZGFIWiJvPHJuNkpPaFJnLUBBXCdiVmhPREMhNFAsaiZNYG85aWJFMzBRQ0slZUROTGV0JVJPPD09KkgpPDMwK2gnI21dW0ZZKmJYX1BSRGBSL1dTMEsnJiImOzRJLzcxbTZBOGgjLC9nT1ZeYmlYWGtDYyVDZlRybDBXPXB1aElPNU0wI14uS20ydDY2PF5rIyQtK0dDbnUhL01BKEMkVSxWPkhOOioiSzRcIjVSYjQyKihjIjMjWi9SP0VjZCY+dUwvXUNSWEhrMVsuUDg2YF1YaCM+cyJkbGJOXjdCVDctYFx0XjxMVFg5aD1pPixqXiZYJWphRDNIZVIpSilOUlZ1JEVIcloycDNIcFEwYlA6aExUVT04S3NecGlLMCxKUWRmZEZnQVxNaigmLDswUXEkUXQ3QW9zPSdwck1DaDozQi9gST9QZ1xBJnE2SU1LPzBWUGdNJ24qKTdKdFBNYVItPXI2WTdPJTQ+NFs7c0EvNzRzaitxP2YkVGs9TkNuMkw7YVw0aVxldV1hJ0xFWC0/SFdkS1QmJ1w1OGJUMCJhWnRva1pDZW1xJyklJ3JJKVdsUCxmS0QkazRJampwSjJtZG9OQGl1X0o/XThaNyJyO0ZGNjYyNyUmWUlaVHBQVzBKbVplJmJHUkpUMUczdVwoZDNGa2xaRiFDKFpgLDxUXSplUkNCNUg7NG8pRl8zRCJRRVZNaG1iVzJYazIsbT1NZFNIRHBbbWBJZUJGKEEmUyJLLzs9Nl1sRCVPb1BPbmQ3RGcoYSFfKlotJiJOcUxhYWQsaSpBLUpzcWQtR0xLYzt0NWFhdFBsRT90bzFAQDheW0BiZnJpcDU5NDxNKWU4PVk8ajcyX34+ZW5kc3RyZWFtCmVuZG9iagp4cmVmCjAgMTAKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDYxIDAwMDAwIG4gCjAwMDAwMDAxMTIgMDAwMDAgbiAKMDAwMDAwMDIxOSAwMDAwMCBuIAowMDAwMDAwMzMxIDAwMDAwIG4gCjAwMDAwMDA0NDYgMDAwMDAgbiAKMDAwMDAwMDYzOSAwMDAwMCBuIAowMDAwMDAwNzA3IDAwMDAwIG4gCjAwMDAwMDA5NjggMDAwMDAgbiAKMDAwMDAwMTAyNyAwMDAwMCBuIAp0cmFpbGVyCjw8Ci9JRCAKWzwxN2EzMmNjZDFmNzM3YmQyOTFkZTk5NDBmMjliY2NkOD48MTdhMzJjY2QxZjczN2JkMjkxZGU5OTQwZjI5YmNjZDg+XQolIFJlcG9ydExhYiBnZW5lcmF0ZWQgUERGIGRvY3VtZW50IC0tIGRpZ2VzdCAob3BlbnNvdXJjZSkKCi9JbmZvIDcgMCBSCi9Sb290IDYgMCBSCi9TaXplIDEwCj4+CnN0YXJ0eHJlZgoxOTA0CiUlRU9GCg==","r1":{"candidates":[{"content":{"parts":[{"text":"{\"doc_type\":\"invoice\",\"language\":\"en\",\"fields\":[{\"name\":\"supplier_name\",\"value\":\"Atlantic Print Co.\",\"source_quote\":\"Atlantic Print Co.\",\"page\":1,\"found\":true},{\"name\":\"supplier_province\",\"value\":\"NS\",\"source_quote\":\"NS\",\"page\":1,\"found\":true},{\"name\":\"bill_to_province\",\"value\":\"NS\",\"source_quote\":\"NS\",\"page\":1,\"found\":true},{\"name\":\"gst_hst_number\",\"value\":\"777888999 RT0001\",\"source_quote\":\"777888999 RT0001\",\"page\":1,\"found\":true},{\"name\":\"invoice_number\",\"value\":\"AP-310\",\"source_quote\":\"AP-310\",\"page\":1,\"found\":true},{\"name\":\"invoice_date_raw\",\"value\":\"2026-09-25\",\"source_quote\":\"2026-09-25\",\"page\":1,\"found\":true},{\"name\":\"subtotal\",\"value\":\"$562.00\",\"source_quote\":\"$562.00\",\"page\":1,\"found\":true},{\"name\":\"hst_amount\",\"value\":\"$78.68\",\"source_quote\":\"$78.68\",\"page\":1,\"found\":true},{\"name\":\"total\",\"value\":\"$640.68\",\"source_quote\":\"$640.68\",\"page\":1,\"found\":true}]}"}]}}]},"r2":{"candidates":[{"content":{"parts":[{"text":"{\"doc_type\":\"invoice\",\"language\":\"en\",\"fields\":[{\"name\":\"supplier_name\",\"value\":\"Atlantic Print Co.\",\"source_quote\":\"Atlantic Print Co.\",\"page\":1,\"found\":true},{\"name\":\"supplier_province\",\"value\":\"NS\",\"source_quote\":\"NS\",\"page\":1,\"found\":true},{\"name\":\"bill_to_province\",\"value\":\"NS\",\"source_quote\":\"NS\",\"page\":1,\"found\":true},{\"name\":\"gst_hst_number\",\"value\":\"777888999 RT0001\",\"source_quote\":\"777888999 RT0001\",\"page\":1,\"found\":true},{\"name\":\"invoice_number\",\"value\":\"AP-310\",\"source_quote\":\"AP-310\",\"page\":1,\"found\":true},{\"name\":\"invoice_date_raw\",\"value\":\"2026-09-25\",\"source_quote\":\"2026-09-25\",\"page\":1,\"found\":true},{\"name\":\"subtotal\",\"value\":\"$562.00\",\"source_quote\":\"$562.00\",\"page\":1,\"found\":true},{\"name\":\"hst_amount\",\"value\":\"$78.68\",\"source_quote\":\"$78.68\",\"page\":1,\"found\":true},{\"name\":\"total\",\"value\":\"$640.68\",\"source_quote\":\"$640.68\",\"page\":1,\"found\":true}]}"}]}}]}},"07_NDA-0193_Northshore_NY-law.pdf":{"pdf":"JVBERi0xLjMKJZOMi54gUmVwb3J0TGFiIEdlbmVyYXRlZCBQREYgZG9jdW1lbnQgKG9wZW5zb3VyY2UpCjEgMCBvYmoKPDwKL0YxIDIgMCBSIC9GMiAzIDAgUiAvRjMgNCAwIFIKPj4KZW5kb2JqCjIgMCBvYmoKPDwKL0Jhc2VGb250IC9IZWx2ZXRpY2EgL0VuY29kaW5nIC9XaW5BbnNpRW5jb2RpbmcgL05hbWUgL0YxIC9TdWJ0eXBlIC9UeXBlMSAvVHlwZSAvRm9udAo+PgplbmRvYmoKMyAwIG9iago8PAovQmFzZUZvbnQgL0hlbHZldGljYS1Cb2xkIC9FbmNvZGluZyAvV2luQW5zaUVuY29kaW5nIC9OYW1lIC9GMiAvU3VidHlwZSAvVHlwZTEgL1R5cGUgL0ZvbnQKPj4KZW5kb2JqCjQgMCBvYmoKPDwKL0Jhc2VGb250IC9IZWx2ZXRpY2EtT2JsaXF1ZSAvRW5jb2RpbmcgL1dpbkFuc2lFbmNvZGluZyAvTmFtZSAvRjMgL1N1YnR5cGUgL1R5cGUxIC9UeXBlIC9Gb250Cj4+CmVuZG9iago1IDAgb2JqCjw8Ci9Db250ZW50cyA5IDAgUiAvTWVkaWFCb3ggWyAwIDAgNjEyIDc5MiBdIC9QYXJlbnQgOCAwIFIgL1Jlc291cmNlcyA8PAovRm9udCAxIDAgUiAvUHJvY1NldCBbIC9QREYgL1RleHQgL0ltYWdlQiAvSW1hZ2VDIC9JbWFnZUkgXQo+PiAvUm90YXRlIDAgL1RyYW5zIDw8Cgo+PiAKICAvVHlwZSAvUGFnZQo+PgplbmRvYmoKNiAwIG9iago8PAovUGFnZU1vZGUgL1VzZU5vbmUgL1BhZ2VzIDggMCBSIC9UeXBlIC9DYXRhbG9nCj4+CmVuZG9iago3IDAgb2JqCjw8Ci9BdXRob3IgKGFub255bW91cykgL0NyZWF0aW9uRGF0ZSAoRDoyMDI2MTAwOTEzNTkwNSswMCcwMCcpIC9DcmVhdG9yIChhbm9ueW1vdXMpIC9LZXl3b3JkcyAoKSAvTW9kRGF0ZSAoRDoyMDI2MTAwOTEzNTkwNSswMCcwMCcpIC9Qcm9kdWNlciAoUmVwb3J0TGFiIFBERiBMaWJyYXJ5IC0gXChvcGVuc291cmNlXCkpIAogIC9TdWJqZWN0ICh1bnNwZWNpZmllZCkgL1RpdGxlICh1bnRpdGxlZCkgL1RyYXBwZWQgL0ZhbHNlCj4+CmVuZG9iago4IDAgb2JqCjw8Ci9Db3VudCAxIC9LaWRzIFsgNSAwIFIgXSAvVHlwZSAvUGFnZXMKPj4KZW5kb2JqCjkgMCBvYmoKPDwKL0ZpbHRlciBbIC9BU0NJSTg1RGVjb2RlIC9GbGF0ZURlY29kZSBdIC9MZW5ndGggODgxCj4+CnN0cmVhbQpHYXMxXTlsSyNGJkFAZz5dSGFOMUNtImpSaEMpbz08WVNAOkxJdGZGRS5aaV83WklTSV5PRjRYW145Nz5PWCZXT2JeOHNELENpUXNpO1E6S2dyMCFcNCRYPyQ6KF09ci1LNVczcHFrakJGUTtmRD9LXj80MzRgZiFcQE5ydCFrJW9ONFJcN2BTckEuL0w5cGttMTdMS3JraFNFamQ9IWozbFxNL0VzKjQ5MkdlV2JnSWRiZk9HZU4nSmExOGsmPUQ+KW9mMUwsPjBfcFlyL1dPRXRhUl8qNz5nc19EPzFjIWs6IVBLPGZkZ2hcPGEmKGkpT1FKJ2huIkh0JFUxbVZfLyI2VSVeLjZdZkJCOC9NSDssNnFGbjEwcVtWcnBELllXZmp0IzQvS11DQCdcPnVLWk1wZGg7N1ZrJ2hial1DQSZ1MWF0LEE4NGxfdEpBJj4xUG4sMFdqdDpRLyJhPmsxREEpIj5AIm5qVmdVPl5FZFNBMVFGbEY8MzNTZEsmbVAhPE91Ui0uLVZkaT1eRFwmKGNLTVZoZiwhZ04jLVUsY0VkZWdObDtgYUYnVmxUVS1wWFo0ZmZlYDA6N2hJaUlTVSs2K0FVMTc9cDhQM3FmKi4mdWVuOCUkQ1FATDUzbCsoUlxjOTZEXjtAJjgkRWA8Uj5vamIiP1RTMVEuW1RjKGBkOCNBJ2tYUjshQyYzZipCKVtebidSWTx1Szc+cS9HMiRwUEh1JkAjZDVQaSY2QFpUSklhXjdySlBFZlxKN2BNciFnLV8oSUVYPXUxc1BbNik0RShaUiU0IUVIZ2M7WCFKXSZTR0pWT0RPbFwxUE5BYjM7LnAuMiElZztWP0ZvQysnN0RnN2JHXXAmQl4jJVwzUiVMS2gxSj1wZ1srYC0yL2twXmxuVyxCTTBaVXVnSGVPTChLTlJiYztLL005KUNxJHJIWDU7c1FMRiZLMlFbNEh0a2NfbCdQOitCOls3OSxtW1YrcDJRVislcC1MVGxoWU01bXAzOlt0QlcuciJfNmYsOFtlTlpDRGtZQzJwLDIjPUwyZCRLTVdSbHVlbF0tbmBvaT9sQktkXCM5bkw3X0ZLJVw2TGZXKypaPyVFRjJOWCtFQ0NVX2Nyb15pMiEoazBiU1ZcUFVwbG9nSiUpaVN0UyowKWJvYVcySCR+PmVuZHN0cmVhbQplbmRvYmoKeHJlZgowIDEwCjAwMDAwMDAwMDAgNjU1MzUgZiAKMDAwMDAwMDA2MSAwMDAwMCBuIAowMDAwMDAwMTEyIDAwMDAwIG4gCjAwMDAwMDAyMTkgMDAwMDAgbiAKMDAwMDAwMDMzMSAwMDAwMCBuIAowMDAwMDAwNDQ2IDAwMDAwIG4gCjAwMDAwMDA2MzkgMDAwMDAgbiAKMDAwMDAwMDcwNyAwMDAwMCBuIAowMDAwMDAwOTY4IDAwMDAwIG4gCjAwMDAwMDEwMjcgMDAwMDAgbiAKdHJhaWxlcgo8PAovSUQgCls8NTU2MDMzYTdiNTg1MGQwZjg0NjQ4YjBmZjI4YzJmZWU+PDU1NjAzM2E3YjU4NTBkMGY4NDY0OGIwZmYyOGMyZmVlPl0KJSBSZXBvcnRMYWIgZ2VuZXJhdGVkIFBERiBkb2N1bWVudCAtLSBkaWdlc3QgKG9wZW5zb3VyY2UpCgovSW5mbyA3IDAgUgovUm9vdCA2IDAgUgovU2l6ZSAxMAo+PgpzdGFydHhyZWYKMTk5OAolJUVPRgo=","r1":{"candidates":[{"content":{"parts":[{"text":"{\"doc_type\":\"nda\",\"language\":\"en\",\"fields\":[{\"name\":\"parties\",\"value\":\"Northshore Bank; Cognizant Canada\",\"source_quote\":\"Northshore Bank; Cognizant Canada\",\"page\":1,\"found\":true},{\"name\":\"governing_law\",\"value\":\"State of New York\",\"source_quote\":\"State of New York\",\"page\":1,\"found\":true},{\"name\":\"quebec_party\",\"value\":\"No\",\"source_quote\":\"No\",\"page\":1,\"found\":true},{\"name\":\"privacy_clause\",\"value\":\"Personal Information Protection and Electronic Documents Act\",\"source_quote\":\"Personal Information Protection and Electronic Documents Act\",\"page\":1,\"found\":true}]}"}]}}]},"r2":{"candidates":[{"content":{"parts":[{"text":"{\"doc_type\":\"nda\",\"language\":\"en\",\"fields\":[{\"name\":\"parties\",\"value\":\"Northshore Bank; Cognizant Canada\",\"source_quote\":\"Northshore Bank; Cognizant Canada\",\"page\":1,\"found\":true},{\"name\":\"governing_law\",\"value\":\"New York\",\"source_quote\":\"New York\",\"page\":1,\"found\":true},{\"name\":\"quebec_party\",\"value\":\"No\",\"source_quote\":\"No\",\"page\":1,\"found\":true},{\"name\":\"privacy_clause\",\"value\":\"Personal Information Protection and Electronic Documents Act\",\"source_quote\":\"Personal Information Protection and Electronic Documents Act\",\"page\":1,\"found\":true}]}"}]}}]}},"08_NDA-0194_Laurentian_QC-party.pdf":{"pdf":"JVBERi0xLjMKJZOMi54gUmVwb3J0TGFiIEdlbmVyYXRlZCBQREYgZG9jdW1lbnQgKG9wZW5zb3VyY2UpCjEgMCBvYmoKPDwKL0YxIDIgMCBSIC9GMiAzIDAgUiAvRjMgNCAwIFIKPj4KZW5kb2JqCjIgMCBvYmoKPDwKL0Jhc2VGb250IC9IZWx2ZXRpY2EgL0VuY29kaW5nIC9XaW5BbnNpRW5jb2RpbmcgL05hbWUgL0YxIC9TdWJ0eXBlIC9UeXBlMSAvVHlwZSAvRm9udAo+PgplbmRvYmoKMyAwIG9iago8PAovQmFzZUZvbnQgL0hlbHZldGljYS1Cb2xkIC9FbmNvZGluZyAvV2luQW5zaUVuY29kaW5nIC9OYW1lIC9GMiAvU3VidHlwZSAvVHlwZTEgL1R5cGUgL0ZvbnQKPj4KZW5kb2JqCjQgMCBvYmoKPDwKL0Jhc2VGb250IC9IZWx2ZXRpY2EtT2JsaXF1ZSAvRW5jb2RpbmcgL1dpbkFuc2lFbmNvZGluZyAvTmFtZSAvRjMgL1N1YnR5cGUgL1R5cGUxIC9UeXBlIC9Gb250Cj4+CmVuZG9iago1IDAgb2JqCjw8Ci9Db250ZW50cyA5IDAgUiAvTWVkaWFCb3ggWyAwIDAgNjEyIDc5MiBdIC9QYXJlbnQgOCAwIFIgL1Jlc291cmNlcyA8PAovRm9udCAxIDAgUiAvUHJvY1NldCBbIC9QREYgL1RleHQgL0ltYWdlQiAvSW1hZ2VDIC9JbWFnZUkgXQo+PiAvUm90YXRlIDAgL1RyYW5zIDw8Cgo+PiAKICAvVHlwZSAvUGFnZQo+PgplbmRvYmoKNiAwIG9iago8PAovUGFnZU1vZGUgL1VzZU5vbmUgL1BhZ2VzIDggMCBSIC9UeXBlIC9DYXRhbG9nCj4+CmVuZG9iago3IDAgb2JqCjw8Ci9BdXRob3IgKGFub255bW91cykgL0NyZWF0aW9uRGF0ZSAoRDoyMDI2MTAwOTEzNTkwNSswMCcwMCcpIC9DcmVhdG9yIChhbm9ueW1vdXMpIC9LZXl3b3JkcyAoKSAvTW9kRGF0ZSAoRDoyMDI2MTAwOTEzNTkwNSswMCcwMCcpIC9Qcm9kdWNlciAoUmVwb3J0TGFiIFBERiBMaWJyYXJ5IC0gXChvcGVuc291cmNlXCkpIAogIC9TdWJqZWN0ICh1bnNwZWNpZmllZCkgL1RpdGxlICh1bnRpdGxlZCkgL1RyYXBwZWQgL0ZhbHNlCj4+CmVuZG9iago4IDAgb2JqCjw8Ci9Db3VudCAxIC9LaWRzIFsgNSAwIFIgXSAvVHlwZSAvUGFnZXMKPj4KZW5kb2JqCjkgMCBvYmoKPDwKL0ZpbHRlciBbIC9BU0NJSTg1RGVjb2RlIC9GbGF0ZURlY29kZSBdIC9MZW5ndGggNzM1Cj4+CnN0cmVhbQpHYXJuVDlsbyNCJkFANy5dT1RBNVkmKzRwXE4vVEZGU0tTXkxXbmcnTiIha11QIi05YXFXa2ErMWdfaXBZdCExLl5BJT44MmFVJkJqT18kR21NV2BmTVwqajgiZXFMRSMmSnNPPzI0O2FEWiJvQThEYGQwJzE9NGRENEMpRz5gS1Y6T2NELGA6OUZpPkglLlpBMC0ycEYmISdqT2M2aGxibGlsYiEua15ARypdTydfQzNXLlsoTnFIYl0jMD5CTkROWXJLcVc3aUw5IlM7cTMjPDEjKGRyJlZydCtIYjs8RlNtJEZbOTtSR3E3LyFfQldcRHVgSSQ0a04vX0RNKjtrOGVQJDhOXyFtPGQzY25bP0E7OFpLUUFLPThaRkItayhybDQjWTxiJl0xdWxbKmQlXSg4X2IoNCRPOVBQNE5lKTJrRFdQJEJcUScnLFlbPW1QKW5mPzQpPFskWlIjLWNmYGRHbm8iVWFANEdHPixfQy1IV1JjXltWRW5YNCJoUHBaNSZeWWYxI25rRzlFTkZrQnNja0dIIVkvX0VAXEYoT1JbXk5STiRUPVpmLEpQPmEjMG5tJXJOZ2Y2Jk5gXipIJ1wsQmw3N1RdSCFJImZfJzVdOTZvZ2ZsMzVkO0swJjddJGZCKmYrTjU+KCpmOiVNNVAwVjtCJ0svOyhMaTNvaj0hVDlkVDEmT2VmZiMxX2QrO10xdD1tSiNDb2dTQG5uNUg3K1lsWDxZSCdrL21ubVJOL0svKEk8aGElaEw2QiYiXygzbDZOcT1iaWtVPkQrYHVqWko4Ikw+JnRpZl9OPGJVci05bTlFPVBiQnBXZCMxMGdfbnVvM2V0Z1xATGwuaDojY1o0S2d1Q1taPS09SiIhVjEpJnI7Ll02WjB1MEFOTWMpTVJoR28mSjI+LHQ2ampYKTE6MmZoZlU8TiVjNnE6aHNQSz51R0QvLTg0QXI7aGRdIU1hLU5kNmVNfj5lbmRzdHJlYW0KZW5kb2JqCnhyZWYKMCAxMAowMDAwMDAwMDAwIDY1NTM1IGYgCjAwMDAwMDAwNjEgMDAwMDAgbiAKMDAwMDAwMDExMiAwMDAwMCBuIAowMDAwMDAwMjE5IDAwMDAwIG4gCjAwMDAwMDAzMzEgMDAwMDAgbiAKMDAwMDAwMDQ0NiAwMDAwMCBuIAowMDAwMDAwNjM5IDAwMDAwIG4gCjAwMDAwMDA3MDcgMDAwMDAgbiAKMDAwMDAwMDk2OCAwMDAwMCBuIAowMDAwMDAxMDI3IDAwMDAwIG4gCnRyYWlsZXIKPDwKL0lEIApbPGE2ZWRmNWUxODg5OGEyMzA4MTZiMzFlMDcyMGE3MzI0PjxhNmVkZjVlMTg4OThhMjMwODE2YjMxZTA3MjBhNzMyND5dCiUgUmVwb3J0TGFiIGdlbmVyYXRlZCBQREYgZG9jdW1lbnQgLS0gZGlnZXN0IChvcGVuc291cmNlKQoKL0luZm8gNyAwIFIKL1Jvb3QgNiAwIFIKL1NpemUgMTAKPj4Kc3RhcnR4cmVmCjE4NTIKJSVFT0YK","r1":{"candidates":[{"content":{"parts":[{"text":"{\"doc_type\":\"nda\",\"language\":\"en\",\"fields\":[{\"name\":\"parties\",\"value\":\"Laurentian Insurance; Cognizant Canada\",\"source_quote\":\"Laurentian Insurance; Cognizant Canada\",\"page\":1,\"found\":true},{\"name\":\"governing_law\",\"value\":\"Province of Ontario and the federal laws of Canada\",\"source_quote\":\"Province of Ontario and the federal laws of Canada\",\"page\":1,\"found\":true},{\"name\":\"quebec_party\",\"value\":\"Yes\",\"source_quote\":\"Yes\",\"page\":1,\"found\":true},{\"name\":\"privacy_clause\",\"value\":\"PIPEDA\",\"source_quote\":\"PIPEDA\",\"page\":1,\"found\":true}]}"}]}}]},"r2":{"candidates":[{"content":{"parts":[{"text":"{\"doc_type\":\"nda\",\"language\":\"en\",\"fields\":[{\"name\":\"parties\",\"value\":\"Laurentian Insurance; Cognizant Canada\",\"source_quote\":\"Laurentian Insurance; Cognizant Canada\",\"page\":1,\"found\":true},{\"name\":\"governing_law\",\"value\":\"Province of Ontario and the federal laws of Canada\",\"source_quote\":\"Province of Ontario and the federal laws of Canada\",\"page\":1,\"found\":true},{\"name\":\"quebec_party\",\"value\":\"Yes\",\"source_quote\":\"Yes\",\"page\":1,\"found\":true},{\"name\":\"privacy_clause\",\"value\":\"PIPEDA\",\"source_quote\":\"PIPEDA\",\"page\":1,\"found\":true}]}"}]}}]}}};
const CFG = { model: 'recorded-responses (web demo)', amountTolerance: 0.02, spotAuditRate: 0, defaultPlaceOfSupply: 'ON',
  criticalInvoiceFields: ['supplier_name', 'invoice_number', 'invoice_date_raw', 'subtotal', 'total'], criticalNdaFields: ['parties', 'governing_law'] };
// IDP reviewer front end: S1 Queue · S2 Invoice review · S3 NDA review · S4 Audit · S5 Ops.
// Server-rendered from n8n static data. Actions arrive as query params and are written to the audit log.
function renderApp(sd, q) {
  sd.results = sd.results || []; sd.audit = sd.audit || [];
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const now = () => new Date().toISOString();
  const find = (id) => sd.results.find((r) => r.doc_id === id);
  const fieldsOf = (r) => { try { return JSON.parse(r.fields_json || '{}'); } catch { return {}; } };
  const flagged = (r) => { const f = fieldsOf(r), res = r.resolutions || {}; return Object.entries(f).filter(([k, v]) => (v.reasons || []).length && !res[k]); };
  const clean = (t) => String(t || '').replace(/\s*\((TEST ENTITY|ENTITE TEST)\)/gi, '');
  const short = (m, k) => { const R = [[/QST charged but no QST/, 'Missing QST number'], [/GST\/HST charged but no/, 'Missing GST/HST number'], [/not in the .* format/, 'Invalid tax number'], [/QST charged but place/, 'QST outside Quebec'], [/Expected (HST|GST|QST)/, 'Tax rate mismatch'], [/Subtotal \+ taxes/, "Totals don't add up"], [/Ambiguous date/, 'Ambiguous date'], [/duplicate/i, 'Possible duplicate'], [/Non-Canadian governing law/, 'Non-Canadian governing law'], [/Quebec party/, 'Quebec party: French version?'], [/disagree/, 'Two reads disagree'], [/privacy clause/i, 'No privacy clause']]; for (const [re, l] of R) if (re.test(m)) return l; return /not found/.test(m) ? 'Missing ' + String(k).replace(/_raw$/, '').replace(/_/g, ' ') : m.slice(0, 40); };
  const docLabel = (r) => r.invoice_number || (String(r.file_name).match(/NDA-\d+/) || [r.doc_type === 'nda' ? 'NDA' : r.doc_id])[0];
  const party = (r) => r.doc_type === 'nda' ? (clean(r.supplier_or_party).split(/;\s*/).find((x) => !/cognizant/i.test(x)) || clean(r.supplier_or_party)) : clean(r.supplier_or_party);
  const log = (r, event, detail) => sd.audit.unshift({ timestamp: now(), doc_id: r.doc_id, file_name: r.file_name, actor_type: 'Human', actor: 'Demo reviewer', event, detail: detail || '' });

  // ---------- actions ----------
  let notice = '';
  if (q.reset === '1') { sd.results = []; sd.audit = []; sd.seen = {}; notice = 'Demo data cleared.'; }
  const r0 = q.id ? find(q.id) : null;
  if (r0 && q.act) {
    r0.resolutions = r0.resolutions || {};
    const f = fieldsOf(r0);
    if (q.act === 'resolve' && q.field) {
      const before = (f[q.field] || {}).value || '';
      r0.resolutions[q.field] = { value: q.value ?? before, reason: q.reason || 'Verified on document', at: now() };
      log(r0, `Resolved ${q.field}`, `${before === (q.value ?? before) ? 'Value kept' : `"${before}" → "${q.value}"`} · Reason: ${q.reason || 'Verified on document'}`);
      notice = 'Issue resolved and logged.';
    } else if (q.act === 'exception') {
      r0.status = 'exception'; r0.owner = q.owner || 'AP Lead';
      log(r0, `Sent to exception (owner: ${r0.owner})`, q.reason || ''); notice = `Sent to exception · owner ${r0.owner}.`;
    } else if (q.act === 'approve') {
      if (flagged(r0).length || r0.route === 'manual') notice = r0.route === 'manual' ? 'This document was never read by the AI. Retry extraction or send to exception.' : 'Resolve every issue before approving.';
      else { r0.status = 'approved'; log(r0, 'Approved', 'All issues resolved'); notice = 'Approved and logged.'; }
    } else if (q.act === 'reopen') { r0.status = 'open'; log(r0, 'Reopened', ''); notice = 'Reopened.'; }
  }

  // ---------- shared UI ----------
  const C = { navy: '#000048', blue: '#3C66CE', dblue: '#173793', text: '#000048', muted: '#5A5F7A', line: '#D7DCEA', subtle: '#F4F6FB', canvas: '#EEF1F7' };
  const chip = (t, kind) => { const k = { ok: ['#1F7A45', '#E3F8E7'], warn: ['#B54708', '#FEF0C7'], bad: ['#B42318', '#FEE4E2'], info: ['#3C66CE', '#EEF2FC'], gray: ['#5A5F7A', '#EBEDF3'] }[kind]; return `<span class="chip" style="color:${k[0]};background:${k[1]}">${esc(t)}</span>`; };
  const statusChip = (r) => {
    if (r.status === 'approved') return chip('✓ Approved', 'ok');
    if (r.status === 'exception') return chip('● Exception', 'warn');
    if (r.route === 'manual') return chip('● Manual', 'warn');
    if (r.route === 'audit_sample') return chip('◆ 5% spot audit', 'info');
    return chip('Needs review', 'gray');
  };
  const whyChip = (r) => {
    if (r.status === 'approved') return r.route === 'auto_approve' ? chip('✓ Straight-through', 'ok') : chip('✓ Resolved', 'ok');
    const open = flagged(r);
    if (r.route === 'audit_sample') return chip('◆ 5% spot audit', 'info');
    if (r.route === 'manual') return chip('● ' + (/AI unavailable/.test(r.why_it_needs_you) ? 'AI unavailable · retry' : 'Manual processing'), 'warn');
    if (!open.length) return chip('✓ Ready to approve', 'ok');
    const [k0, v] = open[0]; const msg = short(v.reasons[0], k0);
    return chip((v.status === 'missing' ? '▲ ' : '● ') + msg, v.status === 'missing' ? 'bad' : 'warn') + (open.length > 1 ? ` <span class="muted small">+${open.length - 1} more</span>` : '');
  };
  const url = (p) => '?' + Object.entries(p).filter(([, v]) => v !== undefined && v !== '').map(([k, v]) => k + '=' + encodeURIComponent(v)).join('&');
  const NAV = [['queue', 'Document queue'], ['exceptions', 'Exceptions'], ['suppliers', 'Suppliers'], ['audit', 'Audit log'], ['ops', 'Ops dashboard']];
  const shell = (active, body, opts = {}) => page(`
    <aside class="nav"><div class="brand">IDP · AP &amp; Contracts</div><div class="brandsub">Cognizant Canada (internal)</div>
      ${NAV.map(([k, l]) => `<a class="navi ${k === active ? 'on' : ''}" href="${url({ view: k })}">${l}</a>`).join('')}
      <div class="navfoot">Synthetic data only</div></aside>
    <main class="main">${notice ? `<div class="notice">${esc(notice)}</div>` : ''}${body}</main>`, opts);
  const page = (inner, opts = {}) => `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>IDP · ${esc(opts.title || 'Document queue')}</title>
<style>
*{box-sizing:border-box}body{margin:0;font-family:Inter,"Segoe UI",system-ui,Arial,sans-serif;color:${C.text};background:#fff;font-size:15px}
a{color:inherit;text-decoration:none}.muted{color:${C.muted}}.small{font-size:13px}
.nav{position:fixed;inset:0 auto 0 0;width:232px;background:${C.navy};color:#fff;padding:28px 12px}
.brand{font-weight:700;font-size:15px;padding:0 12px;white-space:nowrap}.fn{max-width:190px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.nw{white-space:nowrap}.brandsub{font-size:12px;color:#AEB6D9;padding:4px 12px 28px}
.navi{display:block;padding:9px 16px;border-radius:6px;margin-bottom:8px;font-size:15px}.navi:hover{background:#0B0B5C}.navi.on{background:${C.dblue};font-weight:600}
.navfoot{position:absolute;bottom:24px;left:24px;font-size:12px;color:#AEB6D9}
.main{margin-left:232px;padding:32px 32px 48px}
h1{font-size:28px;margin:0}.sub{color:${C.muted};margin:6px 0 0}
.head{display:flex;justify-content:space-between;align-items:flex-start;gap:16px;margin-bottom:20px}
.btn{display:inline-block;padding:10px 16px;border-radius:8px;border:1px solid ${C.line};background:#fff;font-weight:600;font-size:14px;cursor:pointer;color:${C.text};font-family:inherit}
.btn.primary{background:${C.navy};border-color:${C.navy};color:#fff}.btn.dis{background:#E3E6EF;border-color:#E3E6EF;color:#8A8FA6;cursor:not-allowed}
.kpis{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:20px}.kpis.k6{grid-template-columns:repeat(3,1fr)}
.kpi{border:1px solid ${C.line};border-radius:10px;padding:14px 16px}.kpi .l{font-size:13px;color:${C.muted};font-weight:500}.kpi .v{font-size:28px;font-weight:700;margin:4px 0}
.tabs{display:flex;gap:32px;border-bottom:1px solid ${C.line};margin-bottom:16px}.tab{padding:8px 0;color:${C.muted}}.tab.on{color:${C.text};font-weight:600;border-bottom:2px solid ${C.navy}}
table{border-collapse:collapse;width:100%}th{background:${C.subtle};color:${C.muted};font-size:13px;font-weight:600;text-align:left;padding:12px}
th:first-child{border-radius:6px 0 0 6px}th:last-child{border-radius:0 6px 6px 0}td{padding:14px 12px;border-bottom:1px solid ${C.line};vertical-align:middle}
tr.row:hover td{background:${C.subtle};cursor:pointer}.chip{display:inline-block;padding:4px 10px;border-radius:12px;font-size:12px;font-weight:600;white-space:nowrap}
.notice{background:#EEF2FC;color:${C.blue};padding:10px 14px;border-radius:8px;margin-bottom:16px;font-weight:500}
.empty{padding:48px;text-align:center;color:${C.muted};border:1px dashed ${C.line};border-radius:10px}
/* review */
.top{position:fixed;top:0;left:0;right:0;height:64px;background:${C.navy};color:#fff;display:flex;align-items:center;justify-content:space-between;padding:0 24px;z-index:5}
.crumb{color:#fff;font-weight:500}.keys{color:#AEB6D9;font-size:13px}
.split{display:grid;grid-template-columns:50% 50%;position:fixed;top:64px;bottom:0;left:0;right:0}
.docpane{background:${C.canvas};padding:16px 24px;display:flex;flex-direction:column;gap:8px}.docpane iframe{flex:1;width:100%;border:1px solid ${C.line};background:#fff;border-radius:2px}
.panel{overflow:auto;padding:24px 24px 96px}.ph{display:flex;justify-content:space-between;align-items:flex-start}.ph h2{font-size:22px;margin:0}
.sec{font-size:13px;font-weight:600;color:${C.muted};margin:20px 0 8px;text-transform:uppercase;letter-spacing:.2px}
.f{display:grid;grid-template-columns:170px 1fr 136px 44px;align-items:center;gap:8px;border:1px solid ${C.line};border-radius:6px;padding:11px 14px;margin-bottom:8px}
.f .lab{color:${C.muted}}.f .val{font-weight:500;word-break:break-word}.f .src{color:${C.blue};font-weight:600;font-size:13px;cursor:help}
.f.bad{border-color:#B42318;background:#FFF6F5}.f.warn{border-color:#E8A302;background:#FFFBEB}
.why{border-radius:6px;padding:12px 14px;margin:-4px 0 12px;font-size:14px}.why.bad{background:#FFF6F5}.why.warn{background:#FFFBEB}
.why .acts{display:flex;flex-wrap:wrap;gap:8px;margin-top:10px;align-items:center}
.why input,.why select{padding:9px 10px;border:1px solid ${C.line};border-radius:8px;font:inherit;font-size:14px;color:${C.text};background:#fff}
.foot{position:fixed;bottom:0;left:50%;right:0;height:64px;border-top:1px solid ${C.line};background:#fff;display:flex;align-items:center;justify-content:space-between;padding:0 24px}
.drawer{position:fixed;top:0;right:0;bottom:0;width:520px;background:#fff;border-left:1px solid ${C.line};box-shadow:-8px 0 24px rgba(0,0,72,.12);z-index:10;overflow:auto;padding:28px}
.scrim{position:fixed;inset:0;background:rgba(0,0,72,.25);z-index:9}
.ev{display:grid;grid-template-columns:12px 1fr;gap:12px;padding-bottom:18px}.dot{width:12px;height:12px;border-radius:6px;margin-top:4px}
.bars{display:flex;align-items:flex-end;gap:28px;height:220px;padding:16px 8px 0}.bar{width:64px;border-radius:4px 4px 0 0}
.card{border:1px solid ${C.line};border-radius:10px;padding:20px}
.upwrap{position:fixed;inset:0;background:rgba(0,0,72,.35);z-index:20;align-items:center;justify-content:center}
.upbox{background:#fff;border-radius:12px;padding:24px;width:620px;max-width:94vw;box-shadow:0 12px 40px rgba(0,0,72,.25)}
.drop{display:flex;flex-direction:column;align-items:center;gap:6px;border:2px dashed ${C.line};border-radius:10px;padding:32px;cursor:pointer;background:${C.subtle}}.drop:hover{border-color:${C.blue}}
.urow{display:grid;grid-template-columns:1fr 70px 150px;gap:8px;align-items:center;padding:10px 0;border-bottom:1px solid ${C.line}}
.dragcover{display:none;position:fixed;inset:12px;border:3px dashed ${C.blue};border-radius:16px;background:rgba(238,242,252,.9);z-index:30;align-items:center;justify-content:center;font-size:22px;font-weight:700;color:${C.blue};pointer-events:none}
</style></head><body>${inner}
<script>
(function(){try{if(location.search.indexOf('act=')>-1||location.search.indexOf('reset=')>-1){var p=new URLSearchParams(location.search);['act','field','value','reason','owner','reset'].forEach(function(k){p.delete(k)});history.replaceState(null,'','?'+p.toString())}}catch(e){}
window.go=function(o){var p=new URLSearchParams(location.search);['act','field','value','reason','owner','reset'].forEach(function(k){p.delete(k)});for(var k in o)p.set(k,o[k]);location.href='?'+p.toString()};
document.addEventListener('keydown',function(e){if(/INPUT|SELECT|TEXTAREA/.test(e.target.tagName))return;var a=document.getElementById('approve'),x=document.getElementById('exc');if(e.key==='a'&&a&&!a.disabled)a.click();if(e.key==='x'&&x)x.click()});
${opts.live ? "setInterval(function(){if(!window.__hold&&(!document.activeElement||document.activeElement===document.body))location.reload()},6000);" : ''}})();
</script></body></html>`;

  const view = q.view || (q.id ? 'doc' : 'queue');
  const sorted = [...sd.results].sort((a, b) => (flagged(b).filter(([, v]) => v.status === 'missing').length - flagged(a).filter(([, v]) => v.status === 'missing').length) || String(b.processed_at).localeCompare(String(a.processed_at)));
  const needs = sd.results.filter((r) => !['approved', 'exception'].includes(r.status));  // includes Manual: they need a person too
  const exc = sd.results.filter((r) => r.status === 'exception');
  const autoA = sd.results.filter((r) => r.route === 'auto_approve');
  const stp = sd.results.length ? Math.round((autoA.length / sd.results.length) * 100) : 0;
  const amount = (r) => r.doc_type === 'invoice' && r.total !== '' && r.total != null ? '$' + Number(r.total).toLocaleString('en-CA', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : 'n/a';
  const time = (t) => { try { return new Date(t).toLocaleTimeString('en-CA', { hour: '2-digit', minute: '2-digit' }); } catch { return ''; } };
  const kpi = (l, v, s) => `<div class="kpi"><div class="l">${l}</div><div class="v">${v}</div><div class="muted small">${s}</div></div>`;
  const docTable = (rows) => rows.length ? `<table><tr><th>Document</th><th>Type</th><th>Supplier or party</th><th>Prov.</th><th>Amount (CAD)</th><th>Why it needs you</th><th>Received</th><th>Status</th></tr>
    ${rows.map((r) => `<tr class="row" onclick="location.href='${url({ view: 'doc', id: r.doc_id })}'"><td><b>${esc(docLabel(r))}</b><div class="muted small fn" title="${esc(r.file_name)}">${esc(r.file_name)}</div></td>
      <td>${r.doc_type === 'nda' ? 'NDA' : r.doc_type === 'invoice' ? 'Invoice' : 'Other'}${r.language === 'fr' ? ' · FR' : ''}</td><td>${esc(party(r))}</td><td>${esc(r.place_of_supply || r.supplier_province || '')}</td>
      <td>${amount(r)}</td><td>${whyChip(r)}</td><td class="muted nw">${time(r.processed_at)}</td><td>${statusChip(r)}</td></tr>`).join('')}</table>`
    : `<div class="empty">No documents here yet. Click Upload documents or drag files onto this page.</div>`;

  // ---------- S1 queue / exceptions ----------
  if (view === 'queue' || view === 'exceptions') {
    const tab = view === 'exceptions' ? 'exceptions' : (q.tab || 'review');
    const sets = { review: needs, auto: autoA, exceptions: exc, all: sorted };
    const rows = sorted.filter((r) => sets[tab].includes(r));
    const tabs = [['review', `Needs review (${needs.length})`], ['auto', 'Auto-approved'], ['exceptions', `Exceptions (${exc.length})`], ['all', 'All']];
    return shell(view, `<div class="head"><div><h1>${view === 'exceptions' ? 'Exceptions' : 'Document queue'}</h1><p class="sub">Invoices and NDAs waiting for a person. Sorted by risk, then most recent.</p></div>
      <div style="display:flex;gap:12px"><button class="btn primary" onclick="openUp()">Upload documents</button><a class="btn" href="${url({ view: 'queue', tab, reset: '1' })}" onclick="return confirm('Clear all demo data?')">Reset demo</a></div></div>
      <div id="up" class="upwrap" style="display:none" onclick="if(event.target===this)closeUp()"><div class="upbox">
        <div style="display:flex;justify-content:space-between;align-items:center"><h2 style="margin:0;font-size:20px">Upload documents</h2><button class="btn" onclick="closeUp()">✕</button></div>
        <p class="muted small" style="margin:6px 0 16px">Invoices or NDAs · PDF, PNG or JPG · max 20 MB each · synthetic data only</p>
        <label id="drop" class="drop"><input id="files" type="file" multiple accept=".pdf,.png,.jpg,.jpeg" style="display:none" onchange="pick(this.files)"><b>Drop files here</b><span class="muted small">or click to browse</span></label>
        <div id="ulist" style="margin-top:16px"></div>
        <div style="display:flex;justify-content:space-between;align-items:center;margin-top:16px"><span id="unote" class="muted small">Each document takes about 20 seconds (two Gemini reads + Canadian rules).</span><button id="ugo" class="btn primary" onclick="startUp()" disabled>Upload and process</button></div>
      </div></div>
      <div id="dragcover" class="dragcover">Drop to upload</div>
      <script>
      (function(){var Q=[],busy=false;
        window.openUp=function(){document.getElementById('up').style.display='flex';window.__hold=true};
        window.closeUp=function(){if(busy&&!confirm('Uploads are still running. Close anyway?'))return;document.getElementById('up').style.display='none';window.__hold=false;if(Q.length)location.reload()};
        function row(f,i){return '<div class="urow" id="ur'+i+'"><span>'+f.name.replace(/[<>&]/g,'')+'</span><span class="muted small">'+Math.max(1,Math.round(f.size/1024))+' KB</span><span class="chip" id="us'+i+'" style="color:#5A5F7A;background:#EBEDF3">Ready</span></div>'}
        window.pick=function(list){var ok=/\.(pdf|png|jpe?g)$/i;for(var j=0;j<list.length;j++){var f=list[j];if(!ok.test(f.name)||f.size>20*1024*1024){alert(f.name+': PDF, PNG or JPG up to 20 MB only');continue}if(!Q.some(function(x){return x.name===f.name&&x.size===f.size}))Q.push(f)}
          document.getElementById('ulist').innerHTML=Q.map(row).join('');document.getElementById('ugo').disabled=!Q.length||busy};
        function set(i,t,fg,bg){var s=document.getElementById('us'+i);if(s){s.textContent=t;s.style.color=fg;s.style.background=bg}}
        window.startUp=function(){if(busy||!Q.length)return;busy=true;document.getElementById('ugo').disabled=true;var i=0;
          (function next(){if(i>=Q.length){busy=false;document.getElementById('unote').textContent='All sent. The queue refreshes as each result arrives.';setTimeout(function(){location.reload()},20000);return}
            var k=i,fd=new FormData();fd.append('Document',Q[k],Q[k].name);set(k,'Uploading…','#3C66CE','#EEF2FC');
            fetch('/webhook/idp-upload',{method:'POST',body:fd,mode:'no-cors'}).then(function(){set(k,'Processing ~20 s','#B54708','#FEF0C7');
              var left=k<Q.length-1?22:0;setTimeout(function(){set(k,'✓ Sent to pipeline','#1F7A45','#E3F8E7');i++;next()},left*1000)})
            .catch(function(e){set(k,'▲ Failed','#B42318','#FEE4E2');i++;next()})})()};
        var dc=document.getElementById('dragcover'),depth=0;
        document.addEventListener('dragenter',function(e){e.preventDefault();depth++;dc.style.display='flex'});
        document.addEventListener('dragleave',function(){if(--depth<=0){depth=0;dc.style.display='none'}});
        document.addEventListener('dragover',function(e){e.preventDefault()});
        document.addEventListener('drop',function(e){e.preventDefault();depth=0;dc.style.display='none';if(e.dataTransfer&&e.dataTransfer.files.length){openUp();pick(e.dataTransfer.files)}});
      })();
      </script>
      <div class="kpis">${kpi('Needs review', needs.length, 'open documents')}${kpi('Auto-approved', autoA.length, stp + '% straight-through')}${kpi('Exceptions', exc.length, 'owner assigned')}${kpi('Processed', sd.results.length, 'documents in this demo')}</div>
      <div class="tabs">${tabs.map(([k, l]) => `<a class="tab ${k === tab ? 'on' : ''}" href="${url({ view: 'queue', tab: k })}">${l}</a>`).join('')}</div>${docTable(rows)}`, { live: true, title: 'Document queue' });
  }

  // ---------- S5 ops ----------
  if (view === 'ops') {
    let tot = 0, ver = 0; const reasons = {};
    for (const r of sd.results) { for (const v of Object.values(fieldsOf(r))) { if (v.value || v.status !== 'missing') { tot++; if (v.status === 'verified') ver++; } } for (const z of Object.values(r.resolutions || {})) reasons[z.reason] = (reasons[z.reason] || 0) + 1; }
    const counts = [['Auto-approved', autoA.length, C.blue], ['Needs review', needs.length, '#B7C6EE'], ['Exceptions', exc.length, '#E8A302'], ['Approved by reviewer', sd.results.filter((r) => r.status === 'approved' && r.route !== 'auto_approve').length, C.navy]];
    const mx = Math.max(1, ...counts.map((c) => c[1]));
    const rs = Object.entries(reasons).sort((a, b) => b[1] - a[1]); const rmax = Math.max(1, ...rs.map((x) => x[1]));
    return shell('ops', `<div class="head"><div><h1>Ops dashboard</h1><p class="sub">This demo session · synthetic data · amounts in CAD</p></div></div>
      <div class="kpis k6">${kpi('Verified-field rate', (tot ? Math.round((ver / tot) * 100) : 0) + '%', 'grounded + two reads agree + rules pass')}${kpi('Straight-through rate', stp + '%', 'target 40 to 60%')}${kpi('Processed', sd.results.length, 'documents')}
      ${kpi('Open in review', needs.length, 'waiting for a person')}${kpi('Exceptions', exc.length, 'owner assigned')}${kpi('Reviewer decisions', sd.audit.filter((e) => e.actor_type === 'Human').length, 'logged to audit trail')}</div>
      <div style="display:grid;grid-template-columns:2fr 1fr;gap:16px"><div class="card"><b>Documents by outcome</b><div class="bars">${counts.map(([l, v, c]) => `<div style="text-align:center"><div class="small" style="font-weight:600">${v}</div><div class="bar" style="height:${Math.max(4, (v / mx) * 170)}px;background:${c}"></div><div class="small muted" style="margin-top:6px;width:80px">${l}</div></div>`).join('')}</div></div>
      <div class="card"><b>Top correction reasons</b>${rs.length ? rs.map(([k, v]) => `<div style="margin-top:14px"><div style="display:flex;justify-content:space-between"><span>${esc(k)}</span><b>${v}</b></div><div style="height:8px;background:${C.subtle};border-radius:4px;margin-top:6px"><div style="height:8px;width:${(v / rmax) * 100}%;background:${C.blue};border-radius:4px"></div></div></div>`).join('') : '<p class="muted">No reviewer corrections yet.</p>'}</div></div>`, { live: true, title: 'Ops dashboard' });
  }

  // ---------- suppliers ----------
  if (view === 'suppliers') {
    const sup = {};
    for (const r of sd.results.filter((x) => x.doc_type === 'invoice')) { const f = fieldsOf(r); const k = clean(r.supplier_or_party) || 'Unknown'; const s = sup[k] = sup[k] || { n: 0, prov: r.supplier_province, bn: (f.gst_hst_number || {}).value, qst: (f.qst_number || {}).value }; s.n++; }
    const rows = Object.entries(sup);
    return shell('suppliers', `<div class="head"><div><h1>Suppliers</h1><p class="sub">Built from processed invoices. Registration numbers drive ITC / ITR eligibility.</p></div></div>
      ${rows.length ? `<table><tr><th>Supplier</th><th>Province</th><th>GST/HST number</th><th>QST number</th><th>Invoices</th></tr>${rows.map(([k, s]) => `<tr><td><b>${esc(k)}</b></td><td>${esc(s.prov || '')}</td><td>${esc(s.bn || '') || chip('▲ Missing', 'bad')}</td><td>${s.qst ? esc(s.qst) : s.prov === 'QC' ? chip('▲ Missing', 'bad') : '<span class="muted">n/a</span>'}</td><td>${s.n}</td></tr>`).join('')}</table>` : '<div class="empty">No invoices yet.</div>'}`, { title: 'Suppliers' });
  }

  // ---------- audit log (S4 full page) ----------
  const timeline = (evs) => evs.length ? evs.map((e) => { const human = e.actor_type === 'Human'; return `<div class="ev"><div class="dot" style="background:${human ? C.navy : C.blue}"></div><div><div class="small muted">${time(e.timestamp)} &nbsp;${chip(e.actor, human ? 'gray' : 'info')}</div><div style="font-weight:500;margin-top:6px">${esc(e.event)}</div>${e.detail ? `<div class="small muted" style="margin-top:2px">${esc(e.detail)}</div>` : ''}${!q.id && e.file_name ? `<div class="small muted">${esc(e.file_name)}</div>` : ''}</div></div>`; }).join('') : '<p class="muted">No events yet.</p>';
  if (view === 'audit') return shell('audit', `<div class="head"><div><h1>Audit log</h1><p class="sub">Append-only. Every AI and human action, kept 6+ years for CRA.</p></div></div><div class="card" style="max-width:820px">${timeline(sd.audit)}</div>`, { title: 'Audit log' });

  // ---------- S2 / S3 review ----------
  const r = r0;
  if (!r) return shell('queue', `<div class="empty">Document not found. It may have been cleared. <a style="color:${C.blue}" href="${url({ view: 'queue' })}">Back to queue</a></div>`);
  const done = ['approved', 'exception'].includes(r.status);
  const f = fieldsOf(r), res = r.resolutions || {}, open = r.route === 'manual' ? [['_manual', { reasons: [r.why_it_needs_you] }]] : flagged(r), isNda = r.doc_type === 'nda';
  const LABEL = { supplier_name: 'Legal name', supplier_province: 'Province', gst_hst_number: 'GST/HST number', qst_number: 'QST number', invoice_number: 'Invoice number', invoice_date_raw: 'Invoice date', due_date_raw: 'Due date', payment_terms: 'Payment terms', po_number: 'PO number', bill_to_province: 'Place of supply (bill-to)', subtotal: 'Subtotal', gst_amount: 'GST', hst_amount: 'HST', qst_amount: 'QST', pst_amount: 'PST', total: 'Total', currency: 'Currency', parties: 'Parties', nda_type: 'Type', effective_date: 'Effective date', term: 'Term', confidentiality_period: 'Confidentiality period', governing_law: 'Governing law', privacy_clause: 'Privacy clause', quebec_party: 'Quebec party' };
  const SECTIONS = isNda ? [['Parties and term', ['parties', 'nda_type', 'effective_date', 'term', 'confidentiality_period']], ['Risk checks (Canadian playbook)', ['governing_law', 'privacy_clause', 'quebec_party']]]
    : [['Supplier', ['supplier_name', 'supplier_province', 'gst_hst_number', 'qst_number']], ['Invoice', ['invoice_number', 'invoice_date_raw', 'due_date_raw', 'payment_terms', 'po_number', 'bill_to_province']], ['Amounts', ['currency', 'subtotal', 'gst_amount', 'hst_amount', 'qst_amount', 'pst_amount', 'total']]];
  const dateOpts = (raw) => { const m = String(raw).match(/^(\d{1,2})[\/.-](\d{1,2})[\/.-](\d{4})$/); if (!m) return []; const mo = (n) => ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][n - 1]; const iso = (d, mth) => `${m[3]}-${String(mth).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    return [[`${+m[2]} ${mo(+m[1])} ${m[3]}`, iso(+m[2], +m[1]), 'Supplier uses MM/DD'], [`${+m[1]} ${mo(+m[2])} ${m[3]}`, iso(+m[1], +m[2]), 'Supplier uses DD/MM']]; };
  const js = (o) => esc(JSON.stringify(o));
  const fieldRow = (k) => {
    const v = f[k] || { value: '', status: 'missing', reasons: [] }; const z = res[k]; const reasons = v.reasons || [];
    if (!v.value && !reasons.length && !z) return '';
    const kind = z ? 'ok' : reasons.length ? (v.status === 'missing' ? 'bad' : 'warn') : v.auto ? 'info' : v.status === 'verified' ? 'ok' : v.status === 'check' ? 'warn' : 'bad';
    const label = z ? '✓ Resolved' : reasons.length ? (v.status === 'missing' ? (isNda ? '▲ Risk' : (v.value ? '▲ Invalid' : '▲ Missing')) : '▲ Check') : v.auto ? '✓ Auto-resolved' : (isNda ? '✓ Found' : '✓ Verified');
    const shown = z ? (k === 'invoice_date_raw' && /^\d{4}-/.test(z.value) ? z.value : z.value) : (v.display || v.value);
    let out = `<div class="f ${!z && reasons.length ? kind : ''}"><span class="lab">${esc(LABEL[k] || k)}</span><span class="val">${esc(shown) || '<span class="muted">Not found</span>'}</span><span>${chip(label, kind)}</span><span class="src" title="${esc(v.source_quote ? 'Source: “' + v.source_quote + '”' : 'No source text')}" ${v.source_quote ? `onclick="window.flash && flash('${k}')"` : ''}>${v.source_quote ? 'p' + (v.page || 1) + ' ↗' : 'none'}</span></div>`;
    if (z) out += `<div class="why" style="background:${C.subtle}"><span class="muted small">Resolved · ${esc(z.reason)}</span></div>`;
    if (!z && v.note && !reasons.length) out += `<div class="why" style="background:${C.subtle};padding:8px 14px"><span class="small muted">Note · ${esc(v.note)}</span></div>`;
    if (!z && v.auto && !reasons.length) out += `<div class="why" style="background:#EEF2FC;padding:8px 14px"><span class="small" style="color:#3C66CE">AI auto-resolved · ${esc(v.auto)}${v.display && v.display !== v.value ? ' · printed as “' + esc(v.value) + '”' : ''}</span></div>`;
    if (!z && reasons.length && !['approved'].includes(r.status)) {
      const dates = k === 'invoice_date_raw' ? dateOpts(v.value) : [];
      const isLaw = k === 'governing_law' || k === 'quebec_party';
      out += `<div class="why ${kind}">Why: ${esc(reasons.join(' · '))}<div class="acts">
        ${dates.length ? dates.map(([lbl, iso, why]) => `<button class="btn" onclick='go(${js({ act: 'resolve', field: k, value: iso, reason: why })})'>${esc(lbl)}</button>`).join('')
        : isLaw ? `<button class="btn" onclick='go(${js({ act: 'exception', owner: 'Legal', reason: reasons[0] })})'>Escalate to Legal</button>
           <select id="r_${k}"><option>Approved by Legal</option><option>Client standard terms</option><option>French version on file</option></select><button class="btn" onclick="go({act:'resolve',field:'${k}',reason:document.getElementById('r_${k}').value})">Accept with reason</button>`
        : `<input id="v_${k}" value="${esc(v.value)}" placeholder="Correct value" style="width:200px">
           <select id="r_${k}"><option>Verified on document</option><option>Corrected from document</option><option>Requested from supplier</option><option>Confirmed with supplier</option><option>Not a duplicate</option></select>
           <button class="btn" onclick="go({act:'resolve',field:'${k}',value:document.getElementById('v_${k}').value,reason:document.getElementById('r_${k}').value})">Resolve</button>`}</div></div>`;
    }
    return out;
  };
  const title = isNda ? clean(r.supplier_or_party || 'NDA').replace(/;\s*/, ' × ') : (f.supplier_name || {}).value || r.supplier_or_party || r.file_name;
  const meta = r.route === 'manual' ? ['Not yet read by AI'] : isNda ? [docLabel(r), (f.nda_type || {}).value, r.language === 'fr' ? 'French' : 'English'] : [r.invoice_number, 'Invoice', (r.supplier_province || '') + ' supplier', (f.currency || {}).value || 'CAD'];
  const headChip = r.status === 'approved' ? chip('✓ Approved', 'ok') : r.status === 'exception' ? chip('● Exception · ' + (r.owner || ''), 'warn') : open.length ? chip(`▲ ${open.length} ${isNda ? 'risk flag' : 'issue'}${open.length > 1 ? 's' : ''} to resolve`, 'bad') : chip('✓ Ready to approve', 'ok');
  const marks = Object.entries(f).filter(([, v]) => v.source_quote).map(([k, v]) => ({ k, q: v.source_quote, c: res[k] ? 'ok' : (v.reasons || []).length ? (v.status === 'missing' ? 'bad' : 'warn') : 'ok' }));
  const pdf = r.pdf && /pdf/.test(r.mime || 'application/pdf') ? `<div id="pages" style="flex:1;overflow:auto"></div><script type="application/json" id="pdfdata">${JSON.stringify({ b64: r.pdf, marks }).replace(/</g, '\\u003c')}</script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"></script>
<script>(function () {
  var D = JSON.parse(document.getElementById('pdfdata').textContent);
  var host = document.getElementById('pages');
  if (!window.pdfjsLib) { host.innerHTML = '<div class="empty">Preview needs an internet connection to load PDF.js.</div>'; return; }
  pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
  var bytes = Uint8Array.from(atob(D.b64), function (c) { return c.charCodeAt(0); });
  var COL = { ok: '#3C66CE', warn: '#E8A302', bad: '#B42318' };
  var norm = function (s) { return String(s).toLowerCase().replace(/[^a-z0-9à-ÿ]/g, ''); };
  window._boxes = {};
  function drawPage(doc, n) {
    return doc.getPage(n).then(function (pg) {
      var w = host.clientWidth - 8;
      var vp0 = pg.getViewport({ scale: 1 });
      var vp = pg.getViewport({ scale: w / vp0.width });
      var wrap = document.createElement('div');
      wrap.style.cssText = 'position:relative;margin:0 auto 12px;width:' + vp.width + 'px;box-shadow:0 1px 3px rgba(0,0,72,.12);background:#fff';
      var cv = document.createElement('canvas');
      cv.width = vp.width * 2; cv.height = vp.height * 2;
      cv.style.width = vp.width + 'px'; cv.style.display = 'block';
      wrap.appendChild(cv); host.appendChild(wrap);
      return pg.render({ canvasContext: cv.getContext('2d'), viewport: pg.getViewport({ scale: 2 * w / vp0.width }) }).promise
        .then(function () { return pg.getTextContent(); })
        .then(function (tc) {
          tc.items.forEach(function (it) {
            var s = norm(it.str);
            if (s.length < 3) return;
            D.marks.forEach(function (m) {
              var q = norm(m.q);
              if (!(q.indexOf(s) > -1 || (s.indexOf(q) > -1 && q.length > 3))) return;
              var t = pdfjsLib.Util.transform(vp.transform, it.transform);
              var h = Math.hypot(t[2], t[3]), x = t[4], y = t[5] - h, wd = it.width * vp.scale;
              var b = document.createElement('div');
              b.style.cssText = 'position:absolute;left:' + (x - 4) + 'px;top:' + (y - 3) + 'px;width:' + (wd + 8) + 'px;height:' + (h + 7) + 'px;border:2px solid ' + COL[m.c] + ';border-radius:4px;transition:background .3s';
              wrap.appendChild(b);
              (window._boxes[m.k] = window._boxes[m.k] || []).push(b);
            });
          });
        });
    });
  }
  window.flash = function (k) {
    (window._boxes[k] || []).forEach(function (b, i) {
      if (!i) b.scrollIntoView({ block: 'center', behavior: 'smooth' });
      b.style.background = 'rgba(60,102,206,.25)';
      setTimeout(function () { b.style.background = 'transparent'; }, 1200);
    });
  };
  pdfjsLib.getDocument({ data: bytes, isEvalSupported: false }).promise.then(function (doc) {
    var chain = Promise.resolve();
    for (var i = 1; i <= doc.numPages; i++) (function (n) { chain = chain.then(function () { return drawPage(doc, n); }); })(i);
    return chain;
  }).catch(function (e) { host.innerHTML = '<div class="empty">Preview failed: ' + e.message + '</div>'; });
})();
</script>`
    : `<div class="empty" style="flex:1">Original not stored for this document.</div>`;
  const audits = sd.audit.filter((e) => e.doc_id === r.doc_id);
  return page(`<div class="top"><a class="crumb" href="${url({ view: 'queue' })}">← Queue &nbsp;/&nbsp; ${esc(docLabel(r))}</a>
    <span class="keys">Keyboard: A approve · X exception</span><a class="btn" href="${url({ view: 'doc', id: r.doc_id, audit: '1' })}">Audit trail</a></div>
  <div class="split"><div class="docpane"><span class="small muted">${esc(r.file_name)} · Language detected: ${r.language === 'fr' ? 'French' : 'English'}</span>${pdf}</div>
  <div class="panel">${notice ? `<div class="notice">${esc(notice)}</div>` : ''}<div class="ph"><div><h2>${esc(title)}</h2><div class="muted" style="margin-top:6px">${meta.filter(Boolean).map(esc).join(' · ')}</div></div>${headChip}</div>
    <p class="small muted">Extracted by Gemini, validated by Canadian rules. Hover “p1 ↗” to see the exact source text.${r.language === 'fr' ? ' French document, fields shown in English.' : ''}</p>
${r.route === 'manual' ? '<div class="why warn" style="margin-top:16px"><b>' + esc(r.why_it_needs_you) + '</b><div class="acts">' + (r.pdf && !done ? '<button class="btn primary" id="retry" onclick="retryAI(this)">Retry AI extraction</button>' : '') + '<span class="small muted">Or send to exception and key the fields manually.</span></div></div><script>window.retryAI=function(btn){btn.disabled=true;btn.textContent=\'Sending…\';var d=JSON.parse(document.getElementById(\'pdfdata\').textContent);var b=Uint8Array.from(atob(d.b64),function(c){return c.charCodeAt(0)});var fd=new FormData();fd.append(\'Document\',new Blob([b],{type:\'application/pdf\'}),' + esc(JSON.stringify(r.file_name || 'document.pdf')).replace(/&quot;/g, '"') + ');fetch(\'/webhook/idp-upload\',{method:\'POST\',body:fd,mode:\'no-cors\'}).then(function(){go({act:\'exception\',owner:\'AI retry\',reason:\'Re-sent to pipeline\'})})}</script>' : ''}
    ${SECTIONS.map(([s, ks]) => { const rows = ks.map(fieldRow).join(''); return rows ? `<div class="sec">${s}</div>${rows}` : ''; }).join('')}</div></div>
  <div class="foot">${done ? `${statusChip(r)}<button class="btn" onclick="go({act:'reopen'})">Reopen</button>`
    : `<button id="exc" class="btn" onclick="go({act:'exception',owner:'AP Lead'})">Send to exception (X)</button><span class="small muted">${open.length ? `Resolve ${open.length} ${isNda ? 'risk flag' : 'issue'}${open.length > 1 ? 's' : ''} to approve` : 'All checks passed'}</span>
       <button id="approve" class="btn ${open.length ? 'dis' : 'primary'}" ${open.length ? 'disabled' : ''} onclick="go({act:'approve'})">Approve (A)</button>`}</div>
  ${q.audit === '1' ? `<a class="scrim" href="${url({ view: 'doc', id: r.doc_id })}"></a><div class="drawer"><div style="display:flex;justify-content:space-between"><div><h2 style="margin:0">Audit trail</h2><div class="muted small" style="margin-top:6px">${esc(r.invoice_number || r.doc_id)} · Append-only · Retain 6+ years</div></div><a class="btn" href="${url({ view: 'doc', id: r.doc_id })}">✕</a></div><div style="margin-top:24px">${timeline(audits)}</div></div>` : ''}`, { title: r.invoice_number || 'Review' });
}

async function runValidate(P0, R1, R2, SD) {
  const $ = (n) => ({ first: () => ({ json: n === 'Prepare request' ? P0 : R1 }) });
  const $input = { first: () => ({ json: R2 }) };
  const $getWorkflowStaticData = () => SD;
// ===== n8n Code node: "Validate & route (Canadian rules)" =====
// Mode: Run Once for All Items. Input: response of "Gemini · pass 2".
// Reads pass 1 and config from earlier nodes by name.

const prep = $('Prepare request').first().json;
const cfg = prep.config;

function parseGemini(resp) {
  if (!resp || !resp.candidates) return { doc_type: 'other', language: 'other', fields: [], _parseError: 'AI unavailable' };
  const text = resp?.candidates?.[0]?.content?.parts?.map(p => p.text || '').join('') || '';
  try { return JSON.parse(text.replace(/```json|```/g, '').trim()); }
  catch (e) { return { doc_type: 'other', language: 'other', fields: [], _parseError: String(e) }; }
}
const p1 = parseGemini($('Gemini · pass 1').first().json);
const p2 = parseGemini($input.first().json);

const toMap = (r) => Object.fromEntries((r.fields || []).map(f => [f.name, f]));
const f1 = toMap(p1), f2 = toMap(p2);
const docType = p1.doc_type === p2.doc_type ? p1.doc_type : 'other';

// ---------- helpers ----------
const norm = (s) => String(s ?? '').toLowerCase().replace(/[\s\u00a0\u202f$.,:]/g, '');
function money(raw) {
  if (!raw) return null;
  let s = String(raw).replace(/[^\d.,-]/g, '');
  if (!s) return null;
  const lastDot = s.lastIndexOf('.'), lastComma = s.lastIndexOf(',');
  if (lastComma > lastDot) {                       // French: 4 240,00
    const dec = s.length - lastComma - 1;
    s = dec === 2 ? s.replace(/\./g, '').replace(',', '.') : s.replace(/,/g, '');
  } else { s = s.replace(/,/g, ''); }              // English: 4,240.00
  const n = parseFloat(s);
  return Number.isFinite(n) ? n : null;
}
const PROV_NAMES = { 'ontario':'ON','quebec':'QC','québec':'QC','british columbia':'BC','colombie-britannique':'BC','alberta':'AB','manitoba':'MB','saskatchewan':'SK','nova scotia':'NS','nouvelle-écosse':'NS','new brunswick':'NB','nouveau-brunswick':'NB','newfoundland':'NL','terre-neuve':'NL','prince edward island':'PE','île-du-prince-édouard':'PE','yukon':'YT','northwest territories':'NT','nunavut':'NU' };
const POSTAL_FIRST = { A:'NL',B:'NS',C:'PE',E:'NB',G:'QC',H:'QC',J:'QC',K:'ON',L:'ON',M:'ON',N:'ON',P:'ON',R:'MB',S:'SK',T:'AB',V:'BC',Y:'YT' };
function province(raw) {
  const s = String(raw || '').trim();
  const code = s.toUpperCase().match(/\b(ON|QC|BC|AB|MB|SK|NS|NB|NL|PE|YT|NT|NU)\b/);
  if (code) return code[1];
  const low = s.toLowerCase();
  for (const [k, v] of Object.entries(PROV_NAMES)) if (low.includes(k)) return v;
  const pc = s.toUpperCase().match(/\b([ABCEGHJKLMNPRSTVXY])\d[A-Z]\s?\d[A-Z]\d\b/);
  return pc ? POSTAL_FIRST[pc[1]] || null : null;
}
// Simplified rate table. VERIFY with the tax team before use. Rates change.
const RATES = { ON:{hst:0.13}, NS:{hst:0.14}, NB:{hst:0.15}, NL:{hst:0.15}, PE:{hst:0.15},
  QC:{gst:0.05,qst:0.09975}, BC:{gst:0.05,pst:0.07}, MB:{gst:0.05,pst:0.07}, SK:{gst:0.05,pst:0.06},
  AB:{gst:0.05}, NT:{gst:0.05}, NU:{gst:0.05}, YT:{gst:0.05} };
const near = (a, b) => a != null && b != null && Math.abs(a - b) <= cfg.amountTolerance;

// ---------- semantic comparison (small differences are resolved automatically) ----------
const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MONFULL = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
const FR = { janv: 0, 'févr': 1, fevr: 1, mars: 2, avr: 3, mai: 4, juin: 5, juil: 6, 'août': 7, aout: 7, sept: 8, oct: 9, nov: 10, 'déc': 11, dec: 11 };
function toDate(raw) {
  const s = String(raw || '').trim().toLowerCase();
  let y, m, d, assumed = false, x;
  if ((x = s.match(/^(\d{4})[-\/.](\d{1,2})[-\/.](\d{1,2})$/))) { y = +x[1]; m = +x[2]; d = +x[3]; }
  else if ((x = s.match(/^(\d{1,2})[-\/.](\d{1,2})[-\/.](\d{2,4})$/))) {
    y = +x[3] < 100 ? 2000 + +x[3] : +x[3]; const p = +x[1], q = +x[2];
    if (p > 12) { d = p; m = q; } else if (q > 12) { m = p; d = q; } else { m = p; d = q; assumed = p !== q; }  // standard: month/day/year
  } else if ((x = s.match(/^([a-zéû]+)\.?\s+(\d{1,2}),?\s+(\d{4})$/))) { m = MONFULL.indexOf(x[1].slice(0, 3)) + 1; d = +x[2]; y = +x[3]; }
  else if ((x = s.match(/^(\d{1,2})(?:er)?\s+([a-zéû]+)\.?\s+(\d{4})$/))) { const k = x[2].replace(/\.$/, ''); m = (FR[k] ?? FR[k.slice(0, 4)] ?? MONFULL.indexOf(k.slice(0, 3))) + 1; d = +x[1]; y = +x[3]; }
  if (!y || !m || !d || m < 1 || m > 12 || d < 1 || d > 31) return null;
  return { iso: `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`, label: `${MON[m - 1]} ${d}, ${y}`, assumed };
}
const words = (s) => String(s || '').toLowerCase().replace(/\((test entity|entite test)\)/g, '').split(/[^a-z0-9à-ÿ]+/).filter((w) => w.length > 1 && !['the', 'of', 'and', 'et', 'la', 'le', 'de', 'des', 'inc', 'ltd', 'laws', 'law'].includes(w));
function same(name, x, y) {
  if (!x || !y) return false;
  if (/province/.test(name)) { const p = province(x), q = province(y); return !!p && p === q; }
  if (/amount|total|subtotal/.test(name)) { const p = money(x), q = money(y); return p != null && q != null && Math.abs(p - q) <= 0.01; }
  if (/date/.test(name)) { const p = toDate(x), q = toDate(y); return !!p && !!q && p.iso === q.iso; }
  if (/(_number|currency)$/.test(name)) return norm(x).replace(/[^a-z0-9]/g, '') === norm(y).replace(/[^a-z0-9]/g, '');
  const A = words(x), B = words(y); if (!A.length || !B.length) return false;
  const [s, l] = A.length <= B.length ? [A, B] : [B, A];
  return s.filter((w) => l.includes(w)).length / s.length >= 0.8;   // e.g. "State of New York" vs "New York"
}
const autoNotes = [];
// Fields that are informational only: never a reason to send a document to review.
const INFO_ONLY = ['invoice_number', 'gst_hst_number', 'po_number', 'payment_terms', 'due_date_raw', 'supplier_address', 'bill_to_address'];
// Canadian display formats
const cad = (v) => { const n = money(v); return n == null ? null : '$' + n.toLocaleString('en-CA', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); };

// ---------- per-field status ----------
const fields = {};
const issues = [];          // { field, severity: 'critical'|'warn'|'info', message }
const names = new Set([...Object.keys(f1), ...Object.keys(f2)]);
for (const n of names) {
  const a = f1[n] || {}, b = f2[n] || {};
  const grounded = !!(a.found && String(a.value || '').trim() && String(a.source_quote || '').trim());
  const exact = norm(a.value) === norm(b.value);
  const agree = exact || same(n, a.value, b.value);
  fields[n] = { value: a.value || '', source_quote: a.source_quote || '', page: a.page ?? null,
                grounded, agree, status: grounded ? (agree ? 'verified' : 'check') : 'missing', reasons: [] };
  if (grounded && !agree) { if (INFO_ONLY.includes(n)) { fields[n].status = 'verified'; fields[n].note = `Two reads differ ("${a.value}" vs "${b.value}"); not a review item`; } else fields[n].reasons.push(`Two reads disagree: "${a.value}" vs "${b.value}"`); }
  if (grounded && agree && !exact && b.value) { fields[n].auto = `Two reads matched in meaning ("${a.value}" = "${b.value}")`; autoNotes.push(n); }
  if (/date/.test(n) && a.value) { const d = toDate(a.value); if (d) { fields[n].display = d.label; if (d.assumed) { fields[n].auto = 'Read as month/day/year (company date standard)'; autoNotes.push(n); } } }
}
const F = (n) => fields[n] || { value: '', status: 'missing', reasons: [], grounded: false };
function flag(field, severity, message) {
  if (severity !== 'critical' || INFO_ONLY.includes(field)) { severity = 'info'; if (fields[field]) fields[field].note = message; issues.push({ field, severity, message }); return; }
  issues.push({ field, severity, message });
  if (fields[field]) {
    fields[field].reasons.push(message);
    if (severity === 'critical') fields[field].status = 'missing';
    else if (fields[field].status === 'verified') fields[field].status = 'check';
  }
}

// ---------- invoice rules ----------
let supplierProv = null, supplyProv = null, totals = {};
if (docType === 'invoice') {
  for (const n of cfg.criticalInvoiceFields.filter((x) => !INFO_ONLY.includes(x))) {
    if (F(n).status !== 'verified') flag(n, 'critical', F(n).status === 'missing' ? `${n} not found in document` : (F(n).reasons[0] || `${n} needs confirmation`));
  }
  supplierProv = province(F('supplier_province').value) || province(F('supplier_address').value);
  // Place of supply: for most services this follows the recipient (bill-to) address, not the supplier.
  supplyProv = province(F('bill_to_province').value) || province(F('bill_to_address').value) || cfg.defaultPlaceOfSupply;

  const sub = money(F('subtotal').value), tot = money(F('total').value);
  const gst = money(F('gst_amount').value), hst = money(F('hst_amount').value);
  const qst = money(F('qst_amount').value), pst = money(F('pst_amount').value);
  totals = { sub, tot, gst, hst, qst, pst };

  // Registration numbers
  // GST/HST registration number: extracted and displayed only (company rule: not a review item).
  const bn = String(F('gst_hst_number').value || '').toUpperCase().replace(/\s/g, '');
  if (fields.gst_hst_number && /^\d{9}RT\d{4}$/.test(bn)) fields.gst_hst_number.display = bn.slice(0, 9) + ' RT' + bn.slice(11);
  // QST number: mandatory for every Quebec supplier (company rule), and required whenever QST is charged.
  const qn = String(F('qst_number').value || '').toUpperCase().replace(/\s/g, '');
  if (!fields.qst_number) fields.qst_number = { value: '', source_quote: '', page: null, grounded: false, agree: true, status: 'missing', reasons: [] };
  if ((supplierProv === 'QC' || qst) && !qn) flag('qst_number', 'critical', supplierProv === 'QC' ? 'Quebec supplier: QST registration number is mandatory and was not found on the invoice.' : 'QST charged but no QST registration number. Input tax refund (ITR) cannot be claimed.');
  else if (qn && !/^\d{10}TQ\d{4}$/.test(qn)) flag('qst_number', 'critical', `QST number "${F('qst_number').value}" is not in the 1234567890 TQ0001 format.`);
  else if (qn) fields.qst_number.display = qn.slice(0, 10) + ' TQ' + qn.slice(12);

  // Expected tax for place of supply
  const r = RATES[supplyProv];
  if (!r) flag('bill_to_province', 'warn', 'Could not determine place of supply. Tax rate not checked.');
  else if (sub != null) {
    if (r.hst && !near(hst ?? gst, sub * r.hst)) flag(hst != null ? 'hst_amount' : 'gst_amount', 'critical', `Expected HST ${(r.hst*100).toFixed(0)}% for ${supplyProv} (${(sub*r.hst).toFixed(2)}), found ${hst ?? gst ?? 'none'}.`);
    if (r.gst && !near(gst, sub * r.gst)) flag('gst_amount', 'critical', `Expected GST 5% for ${supplyProv} (${(sub*r.gst).toFixed(2)}), found ${gst ?? 'none'}.`);
    if (r.qst && !near(qst, sub * r.qst)) flag('qst_amount', 'critical', `Expected QST 9.975% for ${supplyProv} (${(sub*r.qst).toFixed(2)}), found ${qst ?? 'none'}.`);
    if (!r.qst && qst) flag('qst_amount', 'critical', `QST charged but place of supply is ${supplyProv}.`);
    if (r.pst && pst == null) flag('pst_amount', 'info', `${supplyProv} PST may apply. PST is not recoverable as an ITC; confirm with tax team.`);
  }
  // Arithmetic
  if (sub != null && tot != null) {
    const sum = sub + (gst||0) + (hst||0) + (qst||0) + (pst||0);
    if (!near(sum, tot)) flag('total', 'critical', `Subtotal + taxes = ${sum.toFixed(2)} but total is ${tot.toFixed(2)}.`);
  }
  // Ambiguous DD/MM vs MM/DD
  // Ambiguous dates are resolved automatically as month/day/year (company standard) and noted on the field.
  // Duplicate (persists only in production executions of an active workflow)
  const sd = $getWorkflowStaticData('global'); sd.seen = sd.seen || {};
  const key = `${norm(F('supplier_name').value)}|${norm(F('invoice_number').value)}`;
  if (F('invoice_number').value) {
    if (sd.seen[key]) flag('invoice_number', 'info', `Possible duplicate: same supplier and invoice number received ${new Date(sd.seen[key]).toLocaleString('en-CA', { month: 'short', day: 'numeric', year: 'numeric' })}.`);
    else sd.seen[key] = new Date().toISOString();
  }
}

// ---------- Canadian display formats ----------
for (const [n, f] of Object.entries(fields)) {
  if (!f.value) continue;
  if (/amount|total|subtotal/.test(n)) { const c = cad(f.value); if (c) f.display = c; }
  else if (/province/.test(n)) { const p = province(f.value); if (p) f.display = p; }
}

// ---------- NDA rules (Canadian playbook) ----------
if (docType === 'nda') {
  for (const n of cfg.criticalNdaFields) if (F(n).status !== 'verified') flag(n, 'critical', F(n).status === 'missing' ? `${n} not found in document` : (F(n).reasons[0] || `${n} needs confirmation`));
  const law = String(F('governing_law').value || '').toLowerCase();
  const canadian = /canada|ontario|quebec|québec|british columbia|alberta|manitoba|saskatchewan|nova scotia|new brunswick|newfoundland|prince edward island/.test(law);
  if (law && !canadian) flag('governing_law', 'critical', `Non-Canadian governing law ("${F('governing_law').value}"). Legal sign-off required.`);
  if (/^(yes|oui|true)/i.test(String(F('quebec_party').value || ''))) flag('quebec_party', 'critical', 'Quebec party: check whether a French version is required (Charter of the French Language).');
  if (F('privacy_clause').status === 'missing') flag('privacy_clause', 'warn', 'No privacy clause found. Expect a PIPEDA (or Law 25) reference if personal information is exchanged.');
}

// ---------- guardrails added after false-negative testing ----------
if (docType === 'invoice') {
  // Currency: non-CAD needs FX and tax treatment confirmed by a person.
  const cur = String(F('currency').value || '').toUpperCase().replace(/[^A-Z]/g, '');
  if (cur && cur !== 'CAD') flag('currency', 'critical', `Non-CAD invoice (${cur}): confirm FX rate and tax treatment.`);
  // Dates: catch impossible or stale dates the two reads could both get wrong.
  const inv = toDate(F('invoice_date_raw').value), due = toDate(F('due_date_raw').value);
  const today = new Date().toISOString().slice(0, 10);
  if (inv && inv.iso > today) flag('invoice_date_raw', 'critical', `Invoice date ${inv.label} is in the future.`);
  if (inv && (Date.parse(today) - Date.parse(inv.iso)) / 864e5 > 365) flag('invoice_date_raw', 'critical', `Invoice date ${inv.label} is more than a year old.`);
  if (inv && due && due.iso < inv.iso) flag('invoice_date_raw', 'critical', `Due date ${due.label} is before the invoice date.`);
}
// NDAs: always reviewed by a person during the pilot (legal risk; low volume).
if (docType === 'nda') flag('_policy', 'critical', 'NDA: human review required during pilot.');

// ---------- route ----------
const critical = issues.filter(i => i.severity === 'critical');
let route;
if (docType === 'other' || p1._parseError || p2._parseError) route = 'manual';
else if (critical.length) route = 'review';
else route = Math.random() < cfg.spotAuditRate ? 'audit_sample' : 'auto_approve';

const why = route === 'audit_sample' ? '5% spot audit'
  : route === 'manual' ? (p1._parseError === 'AI unavailable' || p2._parseError === 'AI unavailable' ? 'AI unavailable (Gemini overloaded). Retry AI extraction or key the fields manually.' : 'Unclear document type or unreadable')
  : issues.filter(i => i.severity !== 'info').map(i => i.message).join(' | ') || 'None';

return [{ json: {
  doc_id: prep.docId, received_at: prep.receivedAt, file_name: prep.fileName,
  doc_type: docType, language: p1.language, route,
  why_it_needs_you: why,
  critical_issues: critical.length,
  supplier_or_party: F('supplier_name').value || F('parties').value || '',
  supplier_province: supplierProv || '', place_of_supply: supplyProv || '',
  invoice_number: F('invoice_number').value || '', total: totals.tot ?? '',
  fields_json: JSON.stringify(fields), model: cfg.model,
  auto_resolved: autoNotes.join(', '),
}}];

}
