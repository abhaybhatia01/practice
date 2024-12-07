//db.getCollection("aparebeams").aggregate([{ $group:{_id:'$jobID'}}])

//db.getCollection("aparebeams").aggregate([{ $group:{_id:'$processParameters.highVoltage'}}])

//db.getCollection("aparebeams").aggregate([{$group: {_id: {job: '$jobID',devID: '$devID'}}}])

//db.getCollection("aparebeams").aggregate([
//    // stage 1
//    {$match:{added_by:{$ne:"645f623944e3e928cb01c6b2"}}},
//    // stage 2
//    {$group: {_id: {job: '$jobID',devID: '$devID',added_by:'$added_by'}}}
//])

//db.getCollection("aparebeams").aggregate([
//    // stage 1
//    {$group: {_id: {job: '$jobID',devID: '$devID',added_by:'$added_by'}}},
//    // stage 2
//    {$match:{"_id.added_by":{$eq:"645f623944e3e928cb01c6b2"}}},
//    {$count: 'allDocumentsCount'}
//])

db.getCollection("notifs").aggregate([
{
    $match:{ eventTags: { $size: 1 }}
}
])

//db.getCollection("eventtags").aggregate([
//{
//    $match:{ }
//}
//])