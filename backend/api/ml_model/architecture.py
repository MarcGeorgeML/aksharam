import torch
import torchvision
import torch.nn as nn
import torch.nn.functional as F

num_classes = 49

class ConvNet(nn.Module):
    def __init__(self):
        super(ConvNet, self).__init__()
        
        self.conv1 = nn.Conv2d(3, 6, 5)
        self.pool = nn.AvgPool2d(2, 2)
        
        self.conv2 = nn.Conv2d(6, 16, 5)
        self.pool = nn.AvgPool2d(2, 2)
        
        self.fc1 = nn.Linear(16 * 5 * 5, 120)
        # 16 * 5 * 5 is the size of the input to the fully connected layer
        self.fc2 = nn.Linear(120, 84)
        self.fc3 = nn.Linear(84, num_classes)
    
    def forward(self, x):
        
        # first conv2d layer
        x = self.pool(F.relu(self.conv1(x)))

        # second conv2d layer
        x = self.pool(F.relu(self.conv2(x)))
        
        # flatten the tensor
        x = x.view(-1, 16 * 5 * 5)
        
        
        # first fully connected layer
        x = F.relu(self.fc1(x))
        
        
        # second fully connected layer  
        x = F.relu(self.fc2(x))
        
        
        # third fully connected layer
        x = self.fc3(x)
        # last is softmax layer but that is done by optimizer
        
        return x