# User Needs and Use Specification

## The needs

What the operator must be able to do, without saying how.

| ID                          | Need                                                                                                                      | Traces up |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------- | --------- |
| <span id="un-1">UN-1</span> | Before starting an fMRI examination, the operator must be able to see whether the paradigm will complete within the scan. | -         |
| <span id="un-2">UN-2</span> | When it will not, the operator must be able to see which block to adjust and adjust it in the same screen.                | -         |
| <span id="un-3">UN-3</span> | Every adjustment must be reflected immediately in everything shown, so nothing read before starting is out of date.       | -         |

## Use specification

| Aspect            | This software                                                                                                       |
| ----------------- | ------------------------------------------------------------------------------------------------------------------- |
| Intended use      | Check an fMRI paradigm against the programmed scan before an examination, and adjust block durations until it fits. |
| Intended users    | Clinical operators (radiographers, MRI technologists) trained on the scanner and on fMRI paradigms.                 |
| Primary functions | Load a paradigm; read the verdict; adjust a block or the scan duration; read the effect.                            |
| Patient contact   | None. It shows information; it does not control the scanner or the stimulus.                                        |
